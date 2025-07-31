
import { Customer } from '@/types';

export const customersList: Omit<Customer, "id">[] = [
  // Sector 15 - Chandigarh
  { name: 'Rajesh Kumar', phone: '9876543210', area: 'Sector 15', address: '123 Main Street, Sector 15, Chandigarh', balance: 150.00, isActive: true },
  { name: 'Priya Sharma', phone: '9876543211', area: 'Sector 15', address: '456 Park Avenue, Sector 15, Chandigarh', balance: 0, isActive: true },
  { name: 'Amit Singh', phone: '9876543212', area: 'Sector 15', address: '789 Green Street, Sector 15, Chandigarh', balance: 200.50, isActive: true },
  { name: 'Sunita Devi', phone: '9876543213', area: 'Sector 15', address: '321 Blue Lane, Sector 15, Chandigarh', balance: 75.25, isActive: true },
  { name: 'Rohit Gupta', phone: '9876543214', area: 'Sector 15', address: '654 Red Road, Sector 15, Chandigarh', balance: 0, isActive: true },
  { name: 'Neha Kapoor', phone: '9876543215', area: 'Sector 15', address: '987 Yellow Street, Sector 15, Chandigarh', balance: 125.75, isActive: true },
  { name: 'Vikram Malhotra', phone: '9876543216', area: 'Sector 15', address: '147 Orange Avenue, Sector 15, Chandigarh', balance: 300.00, isActive: true },

  // Sector 22 - Chandigarh
  { name: 'Pooja Agarwal', phone: '9876543217', area: 'Sector 22', address: '258 Silver Lane, Sector 22, Chandigarh', balance: 50.00, isActive: true },
  { name: 'Deepak Bhardwaj', phone: '9876543218', area: 'Sector 22', address: '369 Gold Street, Sector 22, Chandigarh', balance: 175.50, isActive: true },
  { name: 'Kavita Joshi', phone: '9876543219', area: 'Sector 22', address: '741 Diamond Road, Sector 22, Chandigarh', balance: 0, isActive: true },
  { name: 'Manish Verma', phone: '9876543220', area: 'Sector 22', address: '852 Pearl Avenue, Sector 22, Chandigarh', balance: 225.25, isActive: true },
  { name: 'Ritu Saxena', phone: '9876543221', area: 'Sector 22', address: '963 Ruby Lane, Sector 22, Chandigarh', balance: 100.75, isActive: true },
  { name: 'Ajay Chawla', phone: '9876543222', area: 'Sector 22', address: '159 Emerald Street, Sector 22, Chandigarh', balance: 0, isActive: true },

  // Sector 34 - Chandigarh
  { name: 'Sushma Arora', phone: '9876543223', area: 'Sector 34', address: '357 Sapphire Road, Sector 34, Chandigarh', balance: 275.00, isActive: true },
  { name: 'Gaurav Bansal', phone: '9876543224', area: 'Sector 34', address: '468 Topaz Avenue, Sector 34, Chandigarh', balance: 150.50, isActive: true },
  { name: 'Meera Chopra', phone: '9876543225', area: 'Sector 34', address: '579 Amethyst Lane, Sector 34, Chandigarh', balance: 0, isActive: true },
  { name: 'Naveen Jindal', phone: '9876543226', area: 'Sector 34', address: '680 Garnet Street, Sector 34, Chandigarh', balance: 325.75, isActive: true },
  { name: 'Shilpa Goyal', phone: '9876543227', area: 'Sector 34', address: '791 Opal Road, Sector 34, Chandigarh', balance: 75.00, isActive: true },
  { name: 'Tarun Sethi', phone: '9876543228', area: 'Sector 34', address: '802 Jade Avenue, Sector 34, Chandigarh', balance: 200.25, isActive: true },

  // Sector 44 - Chandigarh
  { name: 'Vandana Khanna', phone: '9876543229', area: 'Sector 44', address: '913 Coral Lane, Sector 44, Chandigarh', balance: 0, isActive: true },
  { name: 'Yash Mittal', phone: '9876543230', area: 'Sector 44', address: '024 Quartz Street, Sector 44, Chandigarh', balance: 125.50, isActive: true },
  { name: 'Anjali Sood', phone: '9876543231', area: 'Sector 44', address: '135 Marble Road, Sector 44, Chandigarh', balance: 250.75, isActive: true },
  { name: 'Bharat Tiwari', phone: '9876543232', area: 'Sector 44', address: '246 Granite Avenue, Sector 44, Chandigarh', balance: 0, isActive: true },

  // Mohali - Punjab
  { name: 'Chandan Yadav', phone: '9876543233', area: 'Mohali', address: '357 Limestone Lane, Mohali, Punjab', balance: 175.00, isActive: true },
  { name: 'Divya Garg', phone: '9876543234', area: 'Mohali', address: '468 Sandstone Street, Mohali, Punjab', balance: 300.25, isActive: true },
  { name: 'Harsh Bhatia', phone: '9876543235', area: 'Mohali', address: '579 Slate Road, Mohali, Punjab', balance: 50.50, isActive: true },
  { name: 'Isha Thakur', phone: '9876543236', area: 'Mohali', address: '680 Shale Avenue, Mohali, Punjab', balance: 0, isActive: true },
  { name: 'Karan Sinha', phone: '9876543237', area: 'Mohali', address: '791 Basalt Lane, Mohali, Punjab', balance: 225.75, isActive: true },
  { name: 'Lavanya Nair', phone: '9876543238', area: 'Mohali', address: '802 Flint Street, Mohali, Punjab', balance: 100.00, isActive: true },

  // Panchkula - Haryana
  { name: 'Mohit Aggarwal', phone: '9876543239', area: 'Panchkula', address: '913 Obsidian Road, Panchkula, Haryana', balance: 0, isActive: true },
  { name: 'Nidhi Rastogi', phone: '9876543240', area: 'Panchkula', address: '024 Pumice Avenue, Panchkula, Haryana', balance: 275.25, isActive: true },
  { name: 'Omkar Dubey', phone: '9876543241', area: 'Panchkula', address: '135 Lava Lane, Panchkula, Haryana', balance: 150.50, isActive: true },
  { name: 'Priyanka Mehta', phone: '9876543242', area: 'Panchkula', address: '246 Igneous Street, Panchkula, Haryana', balance: 0, isActive: true },
  { name: 'Raj Khurana', phone: '9876543243', area: 'Panchkula', address: '357 Metamorphic Road, Panchkula, Haryana', balance: 325.00, isActive: true },
  { name: 'Swati Jain', phone: '9876543244', area: 'Panchkula', address: '468 Sedimentary Avenue, Panchkula, Haryana', balance: 75.75, isActive: true },
  { name: 'Tushar Pandey', phone: '9876543245', area: 'Panchkula', address: '579 Volcanic Lane, Panchkula, Haryana', balance: 200.00, isActive: true },
  { name: 'Urvashi Tripathi', phone: '9876543246', area: 'Panchkula', address: '680 Mineral Street, Panchkula, Haryana', balance: 0, isActive: true },
  { name: 'Varun Kohli', phone: '9876543247', area: 'Panchkula', address: '791 Crystal Road, Panchkula, Haryana', balance: 125.25, isActive: true },
  { name: 'Winnie Sharma', phone: '9876543248', area: 'Panchkula', address: '802 Fossil Avenue, Panchkula, Haryana', balance: 250.50, isActive: true }
];
