const { sequelize, Transaksi,KategoriPayment, BankMutasi, User, Bank } = require('../models');

class TransaksiService {
    async createTransaksi(transaksiData) {
        const t = await sequelize.transaction();
        try {
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
                user_id: transaksiData.user_id,
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
      const transaksis = await Transaksi.findAll({
        where: { user_id: userId, active: true },
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
  

  async updateTransaksi(id, updateData) {
    const t = await sequelize.transaction();
  
    try {
      const transaksi = await Transaksi.findOne({ where: { id }, transaction: t });
      if (!transaksi) {
        throw new Error('Transaksi tidak ditemukan');
      }
  
      const oldType = transaksi.tipe; // Save previous transaction type
      const oldJumlah = parseFloat(transaksi.jumlah); // Save previous transaction amount
  
      // Update the transaction
      await Transaksi.update(updateData, {
        where: { id },
        transaction: t
      });
  
      // Fetch the current bank balance
      const bank_id = transaksi.bank_id;
      console.log('Bank ID:', bank_id); // Log the bank_id to debug
      const bank = await Bank.findOne({ where: { id: bank_id }, transaction: t });
      if (!bank) {
        throw new Error('Bank tidak ditemukan');
      }
  
      let saldoSaatIni = parseFloat(bank.saldo);
      if (isNaN(saldoSaatIni)) {
        throw new Error('Invalid saldoSaatIni value');
      }
  
      const jumlahBaru = parseFloat(updateData.jumlah);
      if (isNaN(jumlahBaru)) {
        throw new Error('Invalid jumlah value');
      }
  
      // Check if the transaction type or amount has changed
      if (oldType !== updateData.tipe ) {
        let saldoBaru;
  
        if (oldType === 'Debit') {
          saldoSaatIni -= oldJumlah;
        } else if (oldType === 'Kredit') {
          saldoSaatIni += oldJumlah;
        }
  
        if (updateData.tipe === 'Debit') {
          saldoBaru = saldoSaatIni ;
        } else if (updateData.tipe === 'Kredit') {
          saldoBaru = saldoSaatIni ;
        } else {
          throw new Error('Invalid transaction type');
        }
  
        // Ensure saldoBaru is a valid number and round it to 2 decimal places
        if (isNaN(saldoBaru)) {
          throw new Error('Invalid saldoBaru value');
        }
        saldoBaru = parseFloat(saldoBaru.toFixed(2));
  
        console.log('Saldo Baru:', saldoBaru); // Log saldoBaru for debugging
  
        // Update the bank's balance
        console.log('Updating Bank ID:', bank_id, 'with saldo:', saldoBaru); // Log update details
        await Bank.update(
          { saldo: saldoBaru },
          { where: { id: bank_id }, transaction: t }
        );
  
        // Create BankMutasi
        console.log('Creating BankMutasi for transaksi ID:', id); // Log BankMutasi creation
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
      }
  
      await t.commit();
  
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
  
      if (error.message.includes('invalid "undefined" value')) {
        console.error('Check the id parameters being used in where clauses.');
      }
  
      throw error;
    }
  }
  
  
  
  

  async deleteTransaksi(id) {
    const t = await sequelize.transaction();
  
    try {
      const transaksi = await Transaksi.findByPk(id);
      if (!transaksi) {
        throw new Error('Transaksi tidak ditemukan');
      }
  
      // Fetch the current bank balance and ensure it's a number
      const bank = await Bank.findByPk(transaksi.bank_id);
      if (!bank) {
        throw new Error('Bank tidak ditemukan');
      }
  
      const saldoSaatIni = Number(bank.saldo);
      if (isNaN(saldoSaatIni)) {
        throw new Error('Invalid saldoSaatIni value');
      }
  
      let saldoBaru;
  
      // Calculate the new balance based on the transaction type
      const jumlah = Number(transaksi.jumlah);
      if (isNaN(jumlah)) {
        throw new Error('Invalid jumlah value');
      }
  
      if (transaksi.tipe === 'Debit') {
        saldoBaru = saldoSaatIni - jumlah;
      } else if (transaksi.tipe === 'Kredit') {
        saldoBaru = saldoSaatIni + jumlah;
      } else {
        throw new Error('Invalid transaction type');
      }
  
      // Ensure saldoBaru is a valid number and round it to 2 decimal places
      if (isNaN(saldoBaru)) {
        throw new Error('Invalid saldoBaru value');
      }
      saldoBaru = parseFloat(saldoBaru.toFixed(2));
  
      //console.log('Bank ID:', transaksi.bank_id);
      //console.log('Saldo Baru:', saldoBaru);
  
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
      const [updatedRows] = await Bank.update({ saldo: saldoBaru }, {
        where: { id: transaksi.bank_id },
        transaction: t
      });
  
      if (updatedRows === 0) {
        throw new Error('Failed to update bank saldo');
      }
  
      // Soft delete the transaction
      await Transaksi.update({ active: false }, {
        where: { id },
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
