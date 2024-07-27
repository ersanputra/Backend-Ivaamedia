const { sequelize, Transaksi,KategoriPayment, BankMutasi, User, Bank, UserBusiness } = require('../models');

class TransaksiService {
  async createTransaksi(userId, transaksiData) {
    const t = await sequelize.transaction();
    try {
      console.log("Received transaksiData:", transaksiData);
  
      // Check if the user exists in UserBusiness
      const userBusiness = await UserBusiness.findOne({
        where: { user_id: userId }
      });
  
      if (!userBusiness) {
        throw new Error('User not found in UserBusiness');
      }
  
      // Ambil saldo saat ini dari tabel bank
      const bank = await Bank.findByPk(transaksiData.bank_id, { transaction: t });
      if (!bank) {
        throw new Error('Bank not found');
      }
  
      let saldoSaatIni = parseFloat(bank.saldo);
  
      // Hitung saldo baru berdasarkan tipe transaksi
      let saldoBaru;
      if (transaksiData.tipe === 'Debit') {
        saldoBaru = saldoSaatIni + parseFloat(transaksiData.jumlah);
      } else if (transaksiData.tipe === 'Kredit') {
        saldoBaru = saldoSaatIni - parseFloat(transaksiData.jumlah);
      } else {
        throw new Error('Invalid transaction type');
      }
  
      // Buat Transaksi
      const transaksi = await Transaksi.create({
        bank_id: transaksiData.bank_id,
        nomor: transaksiData.nomor,
        nomor_transaksi: transaksiData.nomor_transaksi,
        tanggal: transaksiData.tanggal,
        jumlah: transaksiData.jumlah,
        kategori_payment_id: transaksiData.kategori_payment_id,
        tipe: transaksiData.tipe,
        catatan: `CREATE: ${transaksiData.catatan || ''}`,
        bukti_transaksi: transaksiData.bukti_transaksi,
        status: transaksiData.status,
        user_id: userId,
        active: transaksiData.active || true
      }, { transaction: t });
  
      // Buat BankMutasi
      const bankMutasi = await BankMutasi.create({
        bank_id: transaksiData.bank_id,
        tanggal: transaksiData.tanggal,
        tipe: transaksiData.tipe,
        jumlah: transaksiData.jumlah,
        catatan: transaksiData.catatan,
        transaksi_id: transaksi.id,
        saldo: saldoBaru, // Saldo baru setelah transaksi
        created_at: new Date(),
        updated_at: new Date()
      }, { transaction: t });
  
      // Update saldo di tabel Bank
      await bank.update({ saldo: saldoBaru }, { transaction: t });
  
      await t.commit();
      return { transaksi, bankMutasi };
    } catch (error) {
      await t.rollback();
      console.error('Failed to create transaksi and bank_mutasi:', error);
      throw error;
    }
  }
    

  async getAllTransaksi() {
    try {
      const transaksis = await Transaksi.findAll({
        where: { active: true },
        include: [{ model: User, as: 'user' }]
      });
      return transaksis;
    } catch (error) {
      console.error('Failed to fetch transaksis:', error);
      throw error;
    }
  }

  async getTransaksiById(id) {
    try {
      const transaksi = await Transaksi.findByPk(id, {
        include: [{ model: User, as: 'user' }]
      });
      if (!transaksi) {
        throw new Error('Transaksi tidak ditemukan');
      }
      return transaksi;
    } catch (error) {
      console.error('Failed to fetch transaksi:', error);
      throw error;
    }
  }

  async getTransaksiByUserId(userId) {
  try {
    // Check if the user exists in UserBusiness
    const userBusiness = await UserBusiness.findOne({
      where: { user_id: userId }
    });

    if (!userBusiness) {
      throw new Error('User not found in UserBusiness');
    }

    const businessId = userBusiness.business_id;

    // Fetch all user_ids that belong to the same business_id
    const userBusinesses = await UserBusiness.findAll({
      where: { business_id: businessId },
      attributes: ['user_id']
    });

    const userIds = userBusinesses.map(ub => ub.user_id);

    // Fetch transaksi for all users in the same business
    const transaksis = await Transaksi.findAll({
      where: { user_id: userIds, active: true },
      include: [
        { model: User, as: 'user' },
        { model: Bank, as: 'bank' },
        { model: KategoriPayment, as: 'kategoripayment' }
      ]
    });

    if (!transaksis.length) {
      throw new Error('Transaksi tidak ditemukan');
    }

    return transaksis;
  } catch (error) {
    console.error('Failed to fetch transaksis by user id:', error);
    throw error;
  }
}
  
async updateTransaksi(userId, id, updateData) {
  const t = await sequelize.transaction();

  try {
    console.log('Received updateData:', updateData); // Log the received data

    // Ensure jumlah is included in updateData
    if (!updateData.jumlah) {
      throw new Error('Jumlah is missing from updateData');
    }

    // Parse and validate the new amount
    let jumlahBaru = parseFloat(updateData.jumlah);
    if (isNaN(jumlahBaru)) {
      throw new Error('Invalid jumlah value');
    }
    jumlahBaru = parseFloat(jumlahBaru.toFixed(2));

    // Fetch the existing transaction
    const transaksi = await Transaksi.findOne({ where: { id }, transaction: t });
    if (!transaksi) {
      throw new Error('Transaksi tidak ditemukan');
    }

    const oldType = transaksi.tipe; // Save previous transaction type
    const oldJumlah = parseFloat(transaksi.jumlah); // Save previous transaction amount

    // Update the transaction record
    await Transaksi.update(updateData, {
      where: { id },
      transaction: t
    });

    // Fetch the current bank balance
    const bank_id = transaksi.bank_id;
    const bank = await Bank.findOne({ where: { id: bank_id }, transaction: t });
    if (!bank) {
      throw new Error('Bank tidak ditemukan');
    }

    let saldoSaatIni = parseFloat(bank.saldo);
    if (isNaN(saldoSaatIni)) {
      throw new Error('Invalid saldoSaatIni value');
    }

    let saldoBaru = saldoSaatIni;

    // Revert the old transaction impact on the balance
    if (oldType === 'Debit') {
      saldoBaru += oldJumlah; // Undo the effect of the old debit
    } else if (oldType === 'Kredit') {
      saldoBaru -= oldJumlah; // Undo the effect of the old credit
    }

    // Apply the new transaction impact on the balance
    if (updateData.tipe === 'Debit') {
      saldoBaru -= jumlahBaru; // Apply the new debit
    } else if (updateData.tipe === 'Kredit') {
      saldoBaru += jumlahBaru; // Apply the new credit
    } else {
      throw new Error('Invalid transaction type');
    }

    saldoBaru = parseFloat(saldoBaru.toFixed(2));

    // Update the bank's balance
    await Bank.update(
      { saldo: saldoBaru },
      { where: { id: bank_id }, transaction: t }
    );

    // Create BankMutasi
    await BankMutasi.create({
      bank_id: bank_id,
      tanggal: new Date(),
      tipe: updateData.tipe,
      jumlah: jumlahBaru,
      catatan: `UPDATE: ${updateData.catatan || ''}`,
      transaksi_id: id,
      saldo: saldoBaru, // New balance after the transaction
      created_at: new Date(),
      updated_at: new Date()
    }, { transaction: t });

    await t.commit();

    // Fetch and return the updated transaction
    return await Transaksi.findOne({
      where: { id },
      include: [
        { model: User, as: 'user' },
        { model: Bank, as: 'bank' },
        { model: KategoriPayment, as: 'kategoripayment' }
      ]
    });
  } catch (error) {
    await t.rollback();
    console.error('Failed to update transaksi:', error);
    throw error;
  }
}


  
  
async deleteTransaksi(userId, transaksiId) {
  const t = await sequelize.transaction();

  try {
      // Check if the user exists in UserBusiness
      const userBusiness = await UserBusiness.findOne({
          where: { user_id: userId },
          transaction: t
      });

      if (!userBusiness) {
          throw new Error('User not found in UserBusiness');
      }

      const businessId = userBusiness.business_id;

      // Fetch all user_ids that belong to the same business_id
      const userBusinesses = await UserBusiness.findAll({
          where: { business_id: businessId },
          attributes: ['user_id'],
          transaction: t
      });

      const userIds = userBusinesses.map(ub => ub.user_id);

      // Fetch the transaction by its ID
      const transaksi = await Transaksi.findByPk(transaksiId, { transaction: t });
      if (!transaksi) {
          throw new Error('Transaksi tidak ditemukan');
      }

      // Fetch the current bank balance and ensure it's a number
      const bank = await Bank.findByPk(transaksi.bank_id, { transaction: t });
      if (!bank) {
          throw new Error('Bank tidak ditemukan');
      }

      const saldoSaatIni = Number(bank.saldo);
      if (isNaN(saldoSaatIni)) {
          throw new Error('Invalid saldoSaatIni value');
      }

      const jumlah = Number(transaksi.jumlah);
      if (isNaN(jumlah)) {
          throw new Error('Invalid jumlah value');
      }

      let saldoBaru;
      if (transaksi.tipe === 'Debit') {
          saldoBaru = saldoSaatIni - jumlah;
      } else if (transaksi.tipe === 'Kredit') {
          saldoBaru = saldoSaatIni + jumlah;
      } else {
          throw new Error('Invalid transaction type');
      }

      saldoBaru = parseFloat(saldoBaru.toFixed(2));

      // Create BankMutasi
      await BankMutasi.create({
          bank_id: transaksi.bank_id,
          tanggal: transaksi.tanggal,
          tipe: transaksi.tipe,
          jumlah: transaksi.jumlah,
          catatan: `DELETE: ${transaksi.catatan || ''}`,
          transaksi_id: transaksi.id,
          saldo: saldoBaru, // New balance after the transaction
          created_at: new Date(),
          updated_at: new Date()
      }, { transaction: t });

      // Update the bank's balance
      const [updatedRows] = await Bank.update(
          { saldo: saldoBaru },
          { where: { id: transaksi.bank_id }, transaction: t }
      );

      if (updatedRows === 0) {
          throw new Error('Failed to update bank saldo');
      }

      // Soft delete the transaction
      await Transaksi.update({ active: false }, {
          where: { id: transaksiId },
          transaction: t
      });

      await t.commit();

      return { message: 'Transaksi berhasil dihapus.' };
  } catch (error) {
      await t.rollback();
      console.error('Failed to delete transaksi:', error);
      throw error;
  }
}

  
}

module.exports = TransaksiService;
