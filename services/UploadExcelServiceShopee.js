const csv = require('csv-parser');
const fs = require('fs');
const xlsx = require('xlsx');
const moment = require('moment-timezone');
const axios = require('axios');

class UploadExcelServiceShopee {
    async processFile(file, marketplaceId) {
        return new Promise((resolve, reject) => {
            if (file.originalname.endsWith('.csv')) {
                const results = [];
                fs.createReadStream(file.path)
                    .pipe(csv())
                    .on('data', (data) => results.push(data))
                    .on('end', async () => {
                        try {
                            // Hapus file setelah diproses
                            fs.unlinkSync(file.path);

                            // Transform data to desired JSON format
                            const transformedResults = await this.transformAllOrders(results, marketplaceId);

                            // Ensure details is always an array
                            transformedResults.forEach(order => {
                                if (!Array.isArray(order.details)) {
                                    order.details = [order.details];
                                }
                            });

                            // Kirim data ke API
                            const apiResults = await this.sendDataToApi(transformedResults);

                            resolve(apiResults);
                        } catch (error) {
                            reject(error);
                        }
                    })
                    .on('error', (error) => {
                        fs.unlinkSync(file.path);
                        reject(error);
                    });
            } else if (file.originalname.endsWith('.xlsx')) {
                const workbook = xlsx.readFile(file.path);
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const data = xlsx.utils.sheet_to_json(worksheet);

                (async () => {
                    try {
                        // Transform data to desired JSON format
                        const transformedData = await this.transformAllOrders(data, marketplaceId);

                        // Ensure details is always an array
                        transformedData.forEach(order => {
                            if (!Array.isArray(order.details)) {
                                order.details = [order.details];
                            }
                        });

                        // Kirim data ke API
                        const apiResults = await this.sendDataToApi(transformedData);

                        // Hapus file setelah diproses
                        fs.unlinkSync(file.path);
                        resolve(apiResults);
                    } catch (error) {
                        fs.unlinkSync(file.path);
                        reject(error);
                    }
                })();
            } else {
                fs.unlinkSync(file.path);
                reject(new Error("Unsupported file format."));
            }
        });
    }

    async transformAllOrders(orders, marketplaceId) {
        const transformedOrders = [];
        for (let i = 0; i < orders.length; i++) {
            const transformedOrder = await this.transformOrderData(orders[i], i + 1, marketplaceId);
            transformedOrders.push(transformedOrder);
        }
        return transformedOrders;
    }

    async transformOrderData(order, lineIndex, marketplaceId) {
        const userId = "1";
        const currentDateTime = moment.tz("Asia/Jakarta");
        
        const year = currentDateTime.format('YY'); // 2 digit tahun
        const month = currentDateTime.format('MM'); // 2 digit bulan
        const date = currentDateTime.format('DD'); // 2 digit tanggal
        const hours = currentDateTime.format('HH'); // 2 digit jam
        const minutes = currentDateTime.format('mm'); // 2 digit menit
        const seconds = currentDateTime.format('ss'); // 2 digit detik

        // Generate order ID
        const orderId = `11${userId}${year}${month}${date}${hours}${minutes}${seconds}${lineIndex}`;

        // Function to extract only numeric values and remove dots
        const extractNumericValue = (value) => parseFloat(value.replace(/[^\d]/g, ''));

        return {
            user_id: userId,
            business_id: "1",
            marketplace_id: marketplaceId,
            order_id: orderId,
            order_number: order["No. Pesanan"],
            customer: {
                name: order["Nama Penerima"],
                phone_number: order["No. Telepon"],
                active: true
            },
            details: [ // Make sure this is an array
                {
                    sku: order["Nomor Referensi SKU"] || order["Nama Variasi"], // Use SKU if available, otherwise use variation
                    name: `${order["Nama Produk"]} - ${order["Nama Variasi"]}`, // Combine product name and variation
                    jumlah: order["Jumlah"],
                    active: true
                }
            ],
            address: {
                address: order["Alamat Pengiriman"],
                sub_district: "", // You need to extract or provide this information
                district: order["Kota/Kabupaten"],
                province: order["Provinsi"],
                active: true
            },
            courier: order["Opsi Pengiriman"],
            status: order["Status Pesanan"],
            payment_method: order["Metode Pembayaran"],
            tracking_number: order["No. Resi"],
            notes: order["Catatan dari Pembeli"] || "",
            order_date: new Date(order["Waktu Pesanan Dibuat"]).toISOString(),
            shipping_cost: extractNumericValue(order["Estimasi Potongan Biaya Pengiriman"]),
            product_price: extractNumericValue(order["Harga Setelah Diskon"]),
            gross_amount: extractNumericValue(order["Total Pembayaran"])
        };
    }

    async sendDataToApi(data) {
        const apiUrl = 'http://localhost:5000/api/orders';
        const results = {
            success: 0,
            failed: 0,
            errors: []
        };
    
        for (const item of data) {
            try {
                await axios.post(apiUrl, item);
                results.success += 1;
                console.log(`Order ${item.order_number} sent successfully`);
            } catch (error) {
                results.failed += 1;
                let errorMessage = error.message;
                if (error.response) {
                    errorMessage = `Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}`;
                }
                results.errors.push({
                    order_number: item.order_number,
                    error: errorMessage
                });
                console.error(`Failed to send order ${item.order_number}: ${errorMessage}`);
            }
        }
    
        return results;
    }
}

module.exports = UploadExcelServiceShopee;
