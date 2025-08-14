import { db } from '../db';
import { assets } from '../db/schema';

async function seed() {
  console.log('Seeding sample assets...');
  // Basic list; serialNumber is unique
  const sample = [
    {
      name: 'Diesel Generator 15kVA',
      model: 'GEN-15K-2022',
      serialNumber: 'GEN-15K-0001',
      location: 'Building A - Power Room (Dept: Facilities, Custodian: John D.)',
      status: 'OPERATIONAL',
      purchaseDate: new Date('2023-03-10'),
    },
    {
      name: 'Split AC Unit',
      model: 'AC-SPLIT-9000BTU',
      serialNumber: 'AC-9000-0456',
      location: 'Building B - Office 203 (Dept: Admin, Custodian: Mary K.)',
      status: 'IN_REPAIR',
      purchaseDate: new Date('2022-08-22'),
    },
    {
      name: 'Submersible Water Pump',
      model: 'PUMP-SUB-2HP',
      serialNumber: 'PUMP-2HP-1122',
      location: 'Building C - Basement (Dept: Engineering, Custodian: Ahmed S.)',
      status: 'DECOMMISSIONED',
      purchaseDate: new Date('2020-01-15'),
    },
    {
      name: 'CCTV NVR',
      model: 'NVR-32CH-4K',
      serialNumber: 'SEC-NVR-0032',
      location: 'Building A - Security Room (Dept: Security, Custodian: Felix O.)',
      status: 'OPERATIONAL',
      purchaseDate: new Date('2024-02-02'),
    },
    {
      name: 'Fire Alarm Control Panel',
      model: 'FACP-ADV-8ZONE',
      serialNumber: 'FIRE-CP-0008',
      location: 'Building B - Lobby (Dept: Safety, Custodian: Grace P.)',
      status: 'OPERATIONAL',
      purchaseDate: new Date('2021-11-05'),
    },
    {
      name: 'Elevator Motor Controller',
      model: 'ELV-MC-V3',
      serialNumber: 'ELV-MC-2007',
      location: 'Building C - Lift Room (Dept: Operations, Custodian: Ivan R.)',
      status: 'IN_REPAIR',
      purchaseDate: new Date('2023-07-19'),
    },
  ];

  for (const item of sample) {
    try {
      await db.insert(assets).values(item as any);
      console.log(`Inserted asset ${item.serialNumber}`);
    } catch (e: any) {
      if (String(e.message || e).includes('UNIQUE')) {
        console.log(`Asset ${item.serialNumber} already exists; skipping.`);
      } else {
        console.error('Insert error:', e);
      }
    }
  }
  console.log('Seeding complete.');
}

seed().then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
});
