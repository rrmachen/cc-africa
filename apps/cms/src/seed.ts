import payload from 'payload';
import path from 'path';
import dotenv from 'dotenv';
import config from './payload.config';

const projectRoot = path.resolve(__dirname, '..');
const envPath = path.resolve(projectRoot, '.env');
dotenv.config({ path: envPath });

const seedData = async () => {
  await payload.init({
    config,
  });

  console.log('🌱 Starting seed process...\n');

  // Create admin user
  console.log('Creating admin user...');
  const admin = await payload.create({
    collection: 'users',
    data: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@ccafrica.org',
      password: 'password123',
      roles: ['admin'],
    },
  });
  console.log(`✅ Admin user created: ${admin.email}\n`);

  // Create church editor users
  console.log('Creating church editor users...');
  const editorKenya = await payload.create({
    collection: 'users',
    data: {
      firstName: 'John',
      lastName: 'Kamau',
      email: 'john.kamau@example.com',
      password: 'password123',
      roles: ['churchEditor'],
    },
  });
  console.log(`✅ Editor created: ${editorKenya.email}`);

  const editorNigeria = await payload.create({
    collection: 'users',
    data: {
      firstName: 'Chioma',
      lastName: 'Okafor',
      email: 'chioma.okafor@example.com',
      password: 'password123',
      roles: ['churchEditor'],
    },
  });
  console.log(`✅ Editor created: ${editorNigeria.email}\n`);

  // Create sample churches
  console.log('Creating sample churches...');

  const church1 = await payload.create({
    collection: 'churches',
    data: {
      name: 'Nairobi Central Church of Christ',
      foundedDate: '1965-03-15',
      denominationAffiliation: 'Churches of Christ',
      location: {
        country: 'Kenya',
        region: 'Nairobi County',
        city: 'Nairobi',
        streetAddress: 'Kenyatta Avenue, CBD',
        coordinates: [36.8219, -1.2921],
      },
      history: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  text: 'The Nairobi Central Church of Christ was established in 1965 by missionaries from the United States working in partnership with local evangelists. The congregation began meeting in a small rented hall with just 15 members.',
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  text: 'Over the decades, the church has grown to become one of the largest congregations in East Africa, with over 300 active members. The church constructed its current building in 1985 and has since added a fellowship hall and classrooms.',
                },
              ],
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          version: 1,
        },
      },
      leadership: {
        elders: [
          {
            name: 'Samuel Mwangi',
            email: 'samuel.mwangi@example.com',
            phone: '+254 712 345 678',
          },
          {
            name: 'David Omondi',
            email: 'david.omondi@example.com',
            phone: '+254 723 456 789',
          },
        ],
        preachers: [
          {
            name: 'Peter Kariuki',
            role: 'Lead Minister',
            email: 'peter.kariuki@example.com',
            phone: '+254 734 567 890',
          },
        ],
      },
      contactInformation: {
        mainPhone: '+254 20 1234567',
        mainEmail: 'info@nairobicentral.org',
        website: 'https://nairobicentral.org',
      },
      meetingTimes: [
        {
          day: 'sunday',
          time: '9:00 AM',
          gatheringType: 'Sunday Worship',
        },
        {
          day: 'wednesday',
          time: '6:30 PM',
          gatheringType: 'Bible Study',
        },
      ],
      status: 'published',
      _status: 'published',
      updatedBy: admin.id,
    },
  });
  console.log(`✅ Church created: ${church1.name}`);

  const church2 = await payload.create({
    collection: 'churches',
    data: {
      name: 'Lagos Mainland Church of Christ',
      foundedDate: '1978-08-20',
      denominationAffiliation: 'Churches of Christ',
      location: {
        country: 'Nigeria',
        region: 'Lagos State',
        city: 'Lagos',
        streetAddress: 'Herbert Macaulay Way, Yaba',
        coordinates: [3.3792, 6.5244],
      },
      history: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  text: 'The Lagos Mainland Church of Christ was planted in 1978 through the efforts of Nigerian Christians who had studied in the United States. The founding members were committed to establishing a congregation that would follow New Testament patterns of worship and organization.',
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  text: 'Today, the congregation serves over 400 members and operates a primary school that serves the local community. The church has also planted several daughter congregations in surrounding areas of Lagos.',
                },
              ],
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          version: 1,
        },
      },
      leadership: {
        elders: [
          {
            name: 'Emmanuel Adeyemi',
            email: 'emmanuel.adeyemi@example.com',
            phone: '+234 802 345 6789',
          },
          {
            name: 'Joseph Oluwaseun',
            email: 'joseph.oluwaseun@example.com',
            phone: '+234 803 456 7890',
          },
        ],
        preachers: [
          {
            name: 'Michael Chukwu',
            role: 'Evangelist',
            email: 'michael.chukwu@example.com',
            phone: '+234 805 678 9012',
          },
        ],
      },
      contactInformation: {
        mainPhone: '+234 1 234 5678',
        mainEmail: 'contact@lagosmainland.org',
        website: 'https://lagosmainland.org',
      },
      meetingTimes: [
        {
          day: 'sunday',
          time: '8:00 AM',
          gatheringType: 'First Service',
        },
        {
          day: 'sunday',
          time: '10:30 AM',
          gatheringType: 'Second Service',
        },
        {
          day: 'thursday',
          time: '6:00 PM',
          gatheringType: 'Bible Study',
        },
      ],
      status: 'published',
      _status: 'published',
      updatedBy: admin.id,
    },
  });
  console.log(`✅ Church created: ${church2.name}`);

  const church3 = await payload.create({
    collection: 'churches',
    data: {
      name: 'Cape Town Church of Christ',
      foundedDate: '1990-05-10',
      denominationAffiliation: 'Churches of Christ',
      location: {
        country: 'South Africa',
        region: 'Western Cape',
        city: 'Cape Town',
        streetAddress: 'Main Road, Observatory',
        coordinates: [18.4241, -33.9249],
      },
      history: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  text: 'The Cape Town Church of Christ was established in 1990, shortly after the end of apartheid. The founding members came from diverse racial backgrounds, united in their commitment to break down barriers and worship together as one body in Christ.',
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  text: 'The congregation has maintained its commitment to racial reconciliation and community service. Members are actively involved in feeding programs, education initiatives, and prison ministry throughout the Cape Town area.',
                },
              ],
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          version: 1,
        },
      },
      leadership: {
        elders: [
          {
            name: 'Thabo Molefe',
            email: 'thabo.molefe@example.com',
            phone: '+27 82 345 6789',
          },
        ],
        preachers: [
          {
            name: 'James van der Merwe',
            role: 'Minister',
            email: 'james.vandermerwe@example.com',
            phone: '+27 83 456 7890',
          },
        ],
      },
      contactInformation: {
        mainPhone: '+27 21 234 5678',
        mainEmail: 'info@capetownchurch.org',
        website: 'https://capetownchurch.org',
      },
      meetingTimes: [
        {
          day: 'sunday',
          time: '9:30 AM',
          gatheringType: 'Sunday Worship',
        },
        {
          day: 'tuesday',
          time: '7:00 PM',
          gatheringType: 'Prayer Meeting',
        },
      ],
      status: 'published',
      _status: 'published',
      updatedBy: admin.id,
    },
  });
  console.log(`✅ Church created: ${church3.name}`);

  // Create a draft church for testing approval workflow
  const church4 = await payload.create({
    collection: 'churches',
    data: {
      name: 'Accra Central Church of Christ',
      foundedDate: '2005-01-15',
      denominationAffiliation: 'Churches of Christ',
      location: {
        country: 'Ghana',
        region: 'Greater Accra',
        city: 'Accra',
        streetAddress: 'Independence Avenue',
      },
      contactInformation: {
        mainEmail: 'info@accracentral.org',
      },
      meetingTimes: [
        {
          day: 'sunday',
          time: '10:00 AM',
          gatheringType: 'Sunday Worship',
        },
      ],
      status: 'draft',
      _status: 'draft',
      updatedBy: admin.id,
    },
  });
  console.log(`✅ Church created (draft): ${church4.name}`);

  // Assign churches to editors
  console.log('\nAssigning churches to editors...');
  await payload.update({
    collection: 'users',
    id: editorKenya.id,
    data: {
      assignedChurches: [church1.id],
    },
  });
  console.log(`✅ Assigned Nairobi church to ${editorKenya.email}`);

  await payload.update({
    collection: 'users',
    id: editorNigeria.id,
    data: {
      assignedChurches: [church2.id],
    },
  });
  console.log(`✅ Assigned Lagos church to ${editorNigeria.email}`);

  console.log('\n✅ Seed completed successfully!\n');
  console.log('📋 Test Accounts Created:');
  console.log('  Admin:');
  console.log('    Email: admin@ccafrica.org');
  console.log('    Password: password123');
  console.log('  Church Editors:');
  console.log('    Email: john.kamau@example.com (can edit Nairobi church)');
  console.log('    Password: password123');
  console.log('    Email: chioma.okafor@example.com (can edit Lagos church)');
  console.log('    Password: password123\n');
  console.log('🌍 Churches Created:');
  console.log('  - Nairobi Central Church of Christ (published)');
  console.log('  - Lagos Mainland Church of Christ (published)');
  console.log('  - Cape Town Church of Christ (published)');
  console.log('  - Accra Central Church of Christ (draft - test approval workflow)\n');

  process.exit(0);
};

seedData().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
