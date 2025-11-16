const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const Student = require('../models/User');
const College = require('../models/College');
const Event = require('../models/Event');

// Interest categories
const interestCategories = [
  'Technology', 'Sports', 'Arts', 'Music', 'Business',
  'Science', 'Literature', 'Gaming', 'Social', 'Environment',
  'Health', 'Education', 'Other'
];

// Demo colleges data
const demoColleges = [
  {
    collegeName: 'MIT University',
    email: 'admin@mit.edu',
    password: 'College@123',
    location: 'Cambridge, MA'
  },
  {
    collegeName: 'Stanford University',
    email: 'admin@stanford.edu',
    password: 'College@123',
    location: 'Stanford, CA'
  },
  {
    collegeName: 'Harvard University',
    email: 'admin@harvard.edu',
    password: 'College@123',
    location: 'Cambridge, MA'
  }
];

// Demo students data
const demoStudents = [
  {
    username: 'john_tech',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john@student.com',
    password: 'Student@123',
    interests: ['Technology', 'Science', 'Gaming']
  },
  {
    username: 'sarah_sports',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah@student.com',
    password: 'Student@123',
    interests: ['Sports', 'Health', 'Social']
  },
  {
    username: 'mike_arts',
    firstName: 'Mike',
    lastName: 'Davis',
    email: 'mike@student.com',
    password: 'Student@123',
    interests: ['Arts', 'Music', 'Literature']
  },
  {
    username: 'emily_business',
    firstName: 'Emily',
    lastName: 'Brown',
    email: 'emily@student.com',
    password: 'Student@123',
    interests: ['Business', 'Technology', 'Education']
  },
  {
    username: 'alex_env',
    firstName: 'Alex',
    lastName: 'Wilson',
    email: 'alex@student.com',
    password: 'Student@123',
    interests: ['Environment', 'Science', 'Social']
  }
];

// Demo events data template
const eventTemplates = [
  // Technology Events
  {
    eventName: 'AI & Machine Learning Hackathon',
    description: 'Join us for a 24-hour hackathon focused on building innovative AI solutions. Teams will compete to create the best machine learning projects with prizes worth $10,000. Participants will work with cutting-edge AI frameworks and receive mentorship from industry experts. The event features workshops on neural networks, natural language processing, and computer vision. Top teams will receive cash prizes, internship opportunities, and access to exclusive AI research resources.',
    eventCategory: 'Technology',
    tags: ['AI', 'Machine Learning', 'Hackathon', 'Coding'],
    difficulty: 'Intermediate',
    location: 'Tech Innovation Center, Building A'
  },
  {
    eventName: 'Web Development Workshop',
    description: 'Learn modern web development with React, Node.js, and MongoDB. Perfect for beginners wanting to build full-stack applications. This comprehensive workshop covers frontend development with React hooks and components, backend API development with Express.js, and database integration with MongoDB. Students will build a complete project from scratch and deploy it to the cloud. Includes hands-on coding exercises, best practices, and industry-standard tools. Leave with a portfolio-ready project and the skills to build modern web applications.',
    eventCategory: 'Technology',
    tags: ['Web Development', 'React', 'Node.js', 'Workshop'],
    difficulty: 'Beginner',
    location: 'Computer Science Building, Room 101'
  },
  {
    eventName: 'Cybersecurity Conference 2024',
    description: 'Annual cybersecurity conference featuring industry experts discussing latest threats, defense strategies, and career opportunities in security. Keynote speakers from Fortune 500 companies will share insights on cloud security, ethical hacking, and incident response. Attendees will participate in live penetration testing demonstrations, network security workshops, and career panels. Learn about zero-trust architecture, blockchain security, and emerging threats in IoT devices. Perfect for students interested in cybersecurity careers, featuring recruitment opportunities and certifications.',
    eventCategory: 'Technology',
    tags: ['Cybersecurity', 'Security', 'Conference', 'Career'],
    difficulty: 'All Levels',
    location: 'Main Auditorium'
  },
  {
    eventName: 'Mobile App Development Bootcamp',
    description: 'Intensive 3-day bootcamp covering iOS and Android development. Build and deploy your first mobile app. Learn Swift for iOS development and Kotlin for Android, or use cross-platform frameworks like React Native and Flutter. The bootcamp includes UI/UX design principles, mobile app architecture, API integration, local data storage, and app deployment to App Store and Google Play. Work on real-world projects with experienced mentors and connect with mobile development companies looking to hire.',
    eventCategory: 'Technology',
    tags: ['Mobile', 'iOS', 'Android', 'Bootcamp'],
    difficulty: 'Intermediate',
    location: 'Innovation Lab'
  },

  // Sports Events
  {
    eventName: 'Annual Basketball Tournament',
    description: 'Inter-college basketball championship with teams from 20+ universities. Register your team and compete for the trophy! This prestigious tournament features three days of intense competition with preliminary rounds, semifinals, and championship finals. Teams compete in regulation games with professional referees and live scoreboards. Includes opening ceremony, halftime performances, and awards banquet. Winners receive trophies, medals, and scholarships. Free entry for spectators, food courts, and live streaming available. Join us for the most exciting basketball event of the year!',
    eventCategory: 'Sports',
    tags: ['Basketball', 'Tournament', 'Competition', 'Team Sports'],
    difficulty: 'All Levels',
    location: 'Sports Arena'
  },
  {
    eventName: 'Marathon for Charity',
    description: '10K charity marathon supporting local healthcare. All proceeds go to community health initiatives. This annual run brings together fitness enthusiasts to support children\'s hospitals and medical research. The scenic route passes through campus grounds and local parks. Includes water stations every 2km, medical support, timing chips, and finisher medals. Register as an individual or form a team. Early bird participants receive a free t-shirt and goodie bag. Post-race celebration with healthy refreshments, music, and prize drawings. Make a difference while staying fit!',
    eventCategory: 'Sports',
    tags: ['Marathon', 'Running', 'Charity', 'Fitness'],
    difficulty: 'Intermediate',
    location: 'Campus Track & Field'
  },
  {
    eventName: 'Yoga & Wellness Workshop',
    description: 'Learn yoga basics, meditation techniques, and healthy lifestyle practices from certified instructors. This beginner-friendly workshop covers fundamental yoga poses, breathing exercises, and mindfulness meditation. Participants will learn stress management techniques, proper alignment, and daily wellness routines. The session includes guided meditation, nutritional advice, and mental health awareness. All equipment provided including yoga mats, blocks, and straps. Wear comfortable clothing and bring a water bottle. Perfect for students dealing with academic stress and looking to improve physical and mental wellbeing.',
    eventCategory: 'Health',
    tags: ['Yoga', 'Wellness', 'Meditation', 'Health'],
    difficulty: 'Beginner',
    location: 'Wellness Center'
  },

  // Arts & Music Events
  {
    eventName: 'Spring Music Festival',
    description: 'Three-day music festival featuring student bands, professional artists, and open mic sessions. All genres welcome! Experience rock, jazz, hip-hop, classical, and electronic music across multiple stages. Daily performances from 2 PM to midnight with food trucks, craft vendors, and interactive art installations. Friday features local talent, Saturday brings regional headliners, and Sunday closes with a special acoustic showcase. Free admission with student ID. VIP passes available with backstage access and artist meet & greets. Bring blankets and lawn chairs for the outdoor venues.',
    eventCategory: 'Music',
    tags: ['Music', 'Festival', 'Live Performance', 'Entertainment'],
    difficulty: 'All Levels',
    location: 'Campus Green'
  },
  {
    eventName: 'Art Exhibition: Modern Perspectives',
    description: 'Student art exhibition showcasing paintings, sculptures, and digital art. Opening night with artist meet & greet. This juried exhibition features works from over 50 student artists exploring contemporary themes through diverse mediums. Gallery hours daily 10 AM - 6 PM with free guided tours at noon. Opening reception includes wine and cheese, artist talks, and live painting demonstrations. Categories include abstract expressionism, photorealism, mixed media, ceramics, and digital installations. All artwork available for purchase with proceeds supporting art scholarships. Special evening events include printmaking workshops and portfolio reviews.',
    eventCategory: 'Arts',
    tags: ['Art', 'Exhibition', 'Painting', 'Sculpture'],
    difficulty: 'All Levels',
    location: 'University Art Gallery'
  },
  {
    eventName: 'Photography Workshop',
    description: 'Learn professional photography techniques, composition, and editing. Bring your camera or smartphone! This hands-on workshop covers exposure triangle (ISO, aperture, shutter speed), composition rules, lighting techniques, and post-processing in Lightroom and Photoshop. Morning session focuses on outdoor photography with golden hour shooting. Afternoon covers portrait photography with studio lighting. Participants complete practical exercises and receive individual feedback. No experience necessary - smartphone photographers welcome. Bring fully charged camera/phone and laptop if possible. Instructors are award-winning photographers with industry experience.',
    eventCategory: 'Arts',
    tags: ['Photography', 'Workshop', 'Visual Arts'],
    difficulty: 'Beginner',
    location: 'Media Arts Building'
  },

  // Business Events
  {
    eventName: 'Startup Pitch Competition',
    description: 'Present your startup idea to venture capitalists and angel investors. Winners receive $50,000 in seed funding. Teams pitch in 3-minute presentations followed by Q&A from a panel of successful entrepreneurs and investors. Finalists receive business mentorship, legal consultation, and access to incubator spaces. Categories include tech startups, social enterprises, and innovative products. Judges evaluate market potential, scalability, team capability, and presentation quality. Top 10 teams get featured in Startup Magazine and invited to exclusive networking events with Silicon Valley investors.',
    eventCategory: 'Business',
    tags: ['Startup', 'Entrepreneurship', 'Pitch', 'Investment'],
    difficulty: 'Intermediate',
    location: 'Business School Auditorium'
  },
  {
    eventName: 'Career Fair 2024',
    description: 'Meet recruiters from Fortune 500 companies. Bring your resume and interview for internships and full-time positions. Over 200 employers representing technology, finance, healthcare, engineering, and consulting industries. On-site interviews, resume reviews, and career counseling available. Companies include Google, Microsoft, Goldman Sachs, Johnson & Johnson, McKinsey, and more. Dress professionally and bring multiple copies of your resume. Attend morning workshops on interview skills, salary negotiation, and networking strategies. Students from all majors welcome. Free professional headshots provided.',
    eventCategory: 'Business',
    tags: ['Career', 'Jobs', 'Networking', 'Recruitment'],
    difficulty: 'All Levels',
    location: 'Convention Center'
  },
  {
    eventName: 'Leadership Summit',
    description: 'Full-day leadership development program with workshops on management, communication, and team building. Morning keynote from Fortune 500 CEO on leadership in the digital age. Breakout sessions cover emotional intelligence, conflict resolution, strategic thinking, and inclusive leadership. Interactive team challenges test decision-making under pressure. Afternoon panels feature young entrepreneurs sharing startup leadership experiences. Includes lunch, networking sessions, and certificate of completion. Learn frameworks used by top companies like Google, Amazon, and Netflix. Perfect for aspiring managers, club leaders, and future executives.',
    eventCategory: 'Business',
    tags: ['Leadership', 'Management', 'Professional Development'],
    difficulty: 'All Levels',
    location: 'Executive Education Center'
  },

  // Science Events
  {
    eventName: 'Science Research Symposium',
    description: 'Annual symposium where students present their research projects. Topics include biology, chemistry, physics, and environmental science. Undergraduate and graduate researchers present poster sessions and oral presentations. Keynote addresses from National Science Foundation awardees and industry scientists. Parallel sessions organized by discipline with faculty judges. Best presentations win travel grants to national conferences and publication opportunities in undergraduate research journals. Networking reception with research labs and graduate schools. Open to all science majors - great for resume building and grad school applications.',
    eventCategory: 'Science',
    tags: ['Research', 'Science', 'Academic', 'Presentation'],
    difficulty: 'Advanced',
    location: 'Science Complex'
  },
  {
    eventName: 'Astronomy Night: Stargazing Event',
    description: 'Observe planets, stars, and galaxies through our telescopes. Expert astronomers will guide the session. Weather permitting, view Saturn\'s rings, Jupiter\'s moons, star clusters, and distant nebulae through our 16-inch research telescope. Indoor presentations on constellation identification, astrophotography, and recent space discoveries. Free star charts and astronomy apps demonstrated. Hot chocolate and snacks provided. Planetarium shows at 7 PM and 9 PM featuring tours of the night sky. Bring warm clothing for rooftop observing. All ages welcome - perfect for beginners curious about the cosmos.',
    eventCategory: 'Science',
    tags: ['Astronomy', 'Space', 'Observation', 'Education'],
    difficulty: 'Beginner',
    location: 'Observatory Rooftop'
  },

  // Social & Environment Events
  {
    eventName: 'Beach Cleanup Drive',
    description: 'Join us for a community beach cleanup. Help protect marine life and earn volunteer hours. Equipment provided including gloves, bags, and safety vests. Teams compete for most trash collected with prizes for winners. Educational stations teach about ocean pollution, microplastics, and marine conservation. Certified divers conduct underwater cleanup. Free beach BBQ lunch for all volunteers. Earn 4 community service hours verified for scholarship applications. Partnered with Ocean Conservancy tracking data for global pollution research. Transportation available from campus. Bring sunscreen, water bottle, and comfortable shoes.',
    eventCategory: 'Environment',
    tags: ['Environment', 'Volunteer', 'Community Service', 'Cleanup'],
    difficulty: 'All Levels',
    location: 'State Beach'
  },
  {
    eventName: 'Cultural Festival',
    description: 'Celebrate diversity with food, music, and dance from around the world. Student performances and cultural exhibits. Experience traditions from 50+ countries through authentic cuisine, traditional clothing displays, and live performances. Dance showcases include Bollywood, salsa, K-pop, African drumming, and Irish step dancing. International food court features dishes from Asia, Africa, Latin America, Europe, and Middle East. Cultural booths offer henna art, calligraphy, origami workshops, and language lessons. Fashion show highlights traditional dress from around the globe. Free admission and all performances livestreamed.',
    eventCategory: 'Social',
    tags: ['Culture', 'Festival', 'Diversity', 'Community'],
    difficulty: 'All Levels',
    location: 'Student Union Plaza'
  },
  {
    eventName: 'Climate Change Workshop',
    description: 'Interactive workshop on climate change impacts and sustainable solutions. Learn how you can make a difference. Expert panel discusses rising temperatures, extreme weather, and ecosystem changes. Hands-on activities include carbon footprint calculation, renewable energy demonstrations, and sustainable living challenges. Breakout groups develop campus sustainability projects with potential funding. Learn about green careers in environmental science, renewable energy, and conservation. Includes documentary screening and Q&A with climate scientists. Receive toolkit for personal climate action and resources for environmental activism. Lunch provided featuring locally-sourced, plant-based options.',
    eventCategory: 'Environment',
    tags: ['Climate', 'Sustainability', 'Workshop', 'Education'],
    difficulty: 'Beginner',
    location: 'Environmental Studies Building'
  },

  // Gaming & Literature Events
  {
    eventName: 'Esports Tournament: League of Legends',
    description: 'Compete in our annual esports championship. Teams of 5 battle for $5,000 prize pool. Double elimination bracket with best-of-3 matches. Professional shoutcasters provide live commentary. Gaming arena features high-spec PCs, gaming chairs, and gigabit internet. Matches livestreamed on Twitch with replay analysis. Top players scouted by collegiate esports programs. Beginner clinic Friday evening for new players. Free entry for spectators with merchandise vendors and food trucks. Finals Sunday evening with awards ceremony. Prize distribution: 1st place $3,000, 2nd $1,500, 3rd $500. All skill levels welcome for qualifying rounds.',
    eventCategory: 'Gaming',
    tags: ['Esports', 'Gaming', 'Competition', 'League of Legends'],
    difficulty: 'Intermediate',
    location: 'Gaming Arena'
  },
  {
    eventName: 'Book Club: Sci-Fi Classics',
    description: 'Monthly book club discussing science fiction literature. This month: Dune by Frank Herbert. Deep dive into themes of ecology, religion, politics, and human evolution in Herbert\'s masterpiece. Compare book to film adaptations including Denis Villeneuve\'s recent version. Moderated discussion explores world-building, character development, and relevance to modern issues. Guest speaker from English department provides literary analysis. Light refreshments served. Next month: Foundation by Isaac Asimov. No preparation required - newcomers welcome even if you haven\'t finished the book. Free copies available for checkout from library.',
    eventCategory: 'Literature',
    tags: ['Books', 'Reading', 'Discussion', 'Sci-Fi'],
    difficulty: 'All Levels',
    location: 'Library Reading Room'
  },
  {
    eventName: 'Creative Writing Workshop',
    description: 'Improve your writing skills with guidance from published authors. All genres welcome. Workshop covers fiction, poetry, creative nonfiction, and screenplay writing. Published authors lead sessions on character development, plot structure, dialogue, and finding your voice. Participants share work for peer critique in supportive environment. Learn revision techniques, overcoming writer\'s block, and publishing strategies. Guest editors from literary magazines discuss submission process. Includes writing prompts, exercises, and take-home assignments. Beginner-friendly with options for advanced writers. Bring notebook and favorite pen. Limited enrollment ensures personalized feedback.',
    eventCategory: 'Literature',
    tags: ['Writing', 'Creative', 'Workshop', 'Authors'],
    difficulty: 'Beginner',
    location: 'English Department'
  }
];

// Function to generate random date in the next 60 days
function getRandomFutureDate() {
  const today = new Date();
  const daysToAdd = Math.floor(Math.random() * 60) + 1;
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + daysToAdd);
  return futureDate;
}

// Function to generate random time
function getRandomTime() {
  const hours = Math.floor(Math.random() * 12) + 9; // 9 AM to 8 PM
  const minutes = Math.random() > 0.5 ? '00' : '30';
  const period = hours < 12 ? 'AM' : 'PM';
  const displayHour = hours > 12 ? hours - 12 : hours;
  return `${displayHour}:${minutes} ${period}`;
}

// Function to create demo ratings
function generateDemoRatings(studentIds, count = 5) {
  const ratings = [];
  const reviews = [
    'Amazing event! Learned so much.',
    'Great organization and very informative.',
    'Really enjoyed this experience.',
    'Excellent speakers and content.',
    'Highly recommend to everyone!',
    'Good event, but could be better organized.',
    'Fantastic networking opportunity.',
    'Well worth my time!',
    'Inspiring and educational.',
    'One of the best events I\'ve attended!'
  ];

  for (let i = 0; i < count; i++) {
    const randomStudent = studentIds[Math.floor(Math.random() * studentIds.length)];
    const rating = Math.floor(Math.random() * 3) + 3; // 3-5 stars
    const review = Math.random() > 0.3 ? reviews[Math.floor(Math.random() * reviews.length)] : '';

    ratings.push({
      studentId: randomStudent,
      rating: rating,
      review: review,
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date in last 30 days
    });
  }

  return ratings;
}

// Function to calculate average rating
function calculateAverageRating(ratings) {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
  return sum / ratings.length;
}

// Main seed function
async function seedDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing demo data...');
    await Student.deleteMany({ email: { $regex: '@student.com$' } });
    await College.deleteMany({ email: { $regex: '@(mit|stanford|harvard).edu$' } });
    await Event.deleteMany({});
    console.log('✅ Existing data cleared');

    // Create demo colleges
    console.log('🏫 Creating demo colleges...');
    const createdColleges = [];
    for (const collegeData of demoColleges) {
      const hashedPassword = await bcrypt.hash(collegeData.password, 10);
      const college = new College({
        ...collegeData,
        password: hashedPassword
      });
      const saved = await college.save();
      createdColleges.push(saved);
      console.log(`   ✓ Created college: ${collegeData.collegeName}`);
    }

    // Create demo students
    console.log('👨‍🎓 Creating demo students...');
    const createdStudents = [];
    for (const studentData of demoStudents) {
      const hashedPassword = await bcrypt.hash(studentData.password, 10);
      const student = new Student({
        ...studentData,
        password: hashedPassword,
        preferences: {
          notificationsEnabled: true,
          recommendationsEnabled: true
        }
      });
      const saved = await student.save();
      createdStudents.push(saved);
      console.log(`   ✓ Created student: ${studentData.username} (Interests: ${studentData.interests.join(', ')})`);
    }

    const studentIds = createdStudents.map(s => s._id);

    // Create demo events
    console.log('📅 Creating demo events...');
    const createdEvents = [];
    for (const eventTemplate of eventTemplates) {
      const randomCollege = createdColleges[Math.floor(Math.random() * createdColleges.length)];
      const ratings = generateDemoRatings(studentIds, Math.floor(Math.random() * 8) + 2);
      const averageRating = calculateAverageRating(ratings);
      const viewCount = Math.floor(Math.random() * 150) + 20;

      const event = new Event({
        ...eventTemplate,
        date: getRandomFutureDate(),
        time: getRandomTime(),
        college: randomCollege._id,
        ratings: ratings,
        averageRating: averageRating,
        viewCount: viewCount,
        popularity: (viewCount * 0.3) + (averageRating * 10 * 0.7),
        participants: []
      });

      const saved = await event.save();

      // Update registration link to point to event details on your website
      saved.registrationLink = `http://localhost:3001/events/${saved._id}`;
      await saved.save();

      createdEvents.push(saved);
      console.log(`   ✓ Created event: ${eventTemplate.eventName} (Rating: ${averageRating.toFixed(1)}, Views: ${viewCount})`);
    }

    // Add event history to students (simulate interactions)
    console.log('📊 Adding event history to students...');
    for (const student of createdStudents) {
      const eventHistory = [];
      const numInteractions = Math.floor(Math.random() * 5) + 3; // 3-7 interactions per student

      for (let i = 0; i < numInteractions; i++) {
        const randomEvent = createdEvents[Math.floor(Math.random() * createdEvents.length)];
        const actions = ['viewed', 'viewed', 'registered', 'attended']; // More views than registrations
        const action = actions[Math.floor(Math.random() * actions.length)];

        eventHistory.push({
          eventId: randomEvent._id,
          action: action,
          timestamp: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000) // Random date in last 60 days
        });
      }

      student.eventHistory = eventHistory;
      await student.save();
      console.log(`   ✓ Added ${eventHistory.length} interactions for ${student.username}`);
    }

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('🎉 DEMO DATA SEEDING COMPLETE!');
    console.log('='.repeat(60));
    console.log(`\n📊 Summary:`);
    console.log(`   Colleges created: ${createdColleges.length}`);
    console.log(`   Students created: ${createdStudents.length}`);
    console.log(`   Events created: ${createdEvents.length}`);
    console.log(`\n🔐 Login Credentials:`);
    console.log('\n   STUDENTS (All use password: Student@123):');
    demoStudents.forEach(s => {
      console.log(`   - ${s.email} | Interests: ${s.interests.join(', ')}`);
    });
    console.log('\n   COLLEGES (All use password: College@123):');
    demoColleges.forEach(c => {
      console.log(`   - ${c.email} | ${c.collegeName}`);
    });
    console.log('\n🧪 Testing Recommendations:');
    console.log('   1. Login as any student above');
    console.log('   2. Go to Student Dashboard');
    console.log('   3. You should see personalized recommendations based on interests');
    console.log('   4. Visit Home page to see trending events');
    console.log('   5. Click on any event to view details and rate it');
    console.log('\n📈 Event Categories Distribution:');
    const categoryCounts = {};
    createdEvents.forEach(e => {
      categoryCounts[e.eventCategory] = (categoryCounts[e.eventCategory] || 0) + 1;
    });
    Object.entries(categoryCounts).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} events`);
    });
    console.log('='.repeat(60) + '\n');

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
