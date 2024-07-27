const csv = require('csv-parser');
const fs = require('fs');
const xlsx = require('xlsx');
const moment = require('moment-timezone');
const axios = require('axios');

class UploadExcelServiceTiktok {
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

                            // Send data to API
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

                        // Send data to API
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

    transformOrderData(order, lineIndex, marketplaceId) {
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
            order_number: order["Order ID"],
            customer: {
                name: order["Recipient"],
                phone_number: order["Phone #"],
                active: true
            },
            detail: {
                name: order["Product Name"],
                jumlah: order["Quantity"],
                active: true
            },
            details: [ // Make sure this is an array
                {
                    sku: order["SKU ID"] || order["Variation"], // Use SKU if available, otherwise use variation
                    name: `${order["Product Name"]} ${order["Variation"]}`, // Combine product name and variation
                    jumlah: order["Quantity"],
                    active: true
                }
            ],
            address: {
                address: order["Detail Address"],
                sub_district: order["Villages"], // Assuming 'Villages' corresponds to sub-district
                district: order["Districts"],
                province: order["Province"],
                active: true
            },
            courier: order["Shipping Provider Name"],
            status: order["Order Status"],
            payment_method: order["Payment Method"],
            tracking_number: order["Tracking ID"],
            notes: order["Buyer Message"] || "",
            order_date: moment(order["Created Time"], 'DD/MM/YYYY HH:mm:ss').toISOString(),
            shipping_cost: extractNumericValue(order["Original Shipping Fee"]),
            product_price: extractNumericValue(order["SKU Subtotal After Discount"]),
            gross_amount: extractNumericValue(order["Order Amount"])
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
                const errorMessage = error.response ? error.response.data : error.message;
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

module.exports = UploadExcelServiceTiktok;
