// import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { z } from "zod";

export const mappings = {
  "react.js": "react",
  reactjs: "react",
  react: "react",
  "next.js": "nextjs",
  nextjs: "nextjs",
  next: "nextjs",
  "vue.js": "vuejs",
  vuejs: "vuejs",
  vue: "vuejs",
  "express.js": "express",
  expressjs: "express",
  express: "express",
  "node.js": "nodejs",
  nodejs: "nodejs",
  node: "nodejs",
  mongodb: "mongodb",
  mongo: "mongodb",
  mongoose: "mongoose",
  mysql: "mysql",
  postgresql: "postgresql",
  sqlite: "sqlite",
  firebase: "firebase",
  docker: "docker",
  kubernetes: "kubernetes",
  aws: "aws",
  azure: "azure",
  gcp: "gcp",
  digitalocean: "digitalocean",
  heroku: "heroku",
  photoshop: "photoshop",
  "adobe photoshop": "photoshop",
  html5: "html5",
  html: "html5",
  css3: "css3",
  css: "css3",
  sass: "sass",
  scss: "sass",
  less: "less",
  tailwindcss: "tailwindcss",
  tailwind: "tailwindcss",
  bootstrap: "bootstrap",
  jquery: "jquery",
  typescript: "typescript",
  ts: "typescript",
  javascript: "javascript",
  js: "javascript",
  "angular.js": "angular",
  angularjs: "angular",
  angular: "angular",
  "ember.js": "ember",
  emberjs: "ember",
  ember: "ember",
  "backbone.js": "backbone",
  backbonejs: "backbone",
  backbone: "backbone",
  nestjs: "nestjs",
  graphql: "graphql",
  "graph ql": "graphql",
  apollo: "apollo",
  webpack: "webpack",
  babel: "babel",
  "rollup.js": "rollup",
  rollupjs: "rollup",
  rollup: "rollup",
  "parcel.js": "parcel",
  parceljs: "parcel",
  npm: "npm",
  yarn: "yarn",
  git: "git",
  github: "github",
  gitlab: "gitlab",
  bitbucket: "bitbucket",
  figma: "figma",
  prisma: "prisma",
  redux: "redux",
  flux: "flux",
  redis: "redis",
  selenium: "selenium",
  cypress: "cypress",
  jest: "jest",
  mocha: "mocha",
  chai: "chai",
  karma: "karma",
  vuex: "vuex",
  "nuxt.js": "nuxt",
  nuxtjs: "nuxt",
  nuxt: "nuxt",
  strapi: "strapi",
  wordpress: "wordpress",
  contentful: "contentful",
  netlify: "netlify",
  vercel: "vercel",
  "aws amplify": "amplify",
};

// export const interviewer: CreateAssistantDTO = {
//   name: "Interviewer",
//   firstMessage:
//     "Hello! Thank you for taking the time to speak with me today. I'm excited to learn more about you and your experience.",
//   transcriber: {
//     provider: "deepgram",
//     model: "nova-2",
//     language: "en",
//   },
//   voice: {
//     provider: "11labs",
//     voiceId: "sarah",
//     stability: 0.4,
//     similarityBoost: 0.8,
//     speed: 0.9,
//     style: 0.5,
//     useSpeakerBoost: true,
//   },
//   model: {
//     provider: "openai",
//     model: "gpt-4",
//     messages: [
//       {
//         role: "system",
//         content: `You are a professional job interviewer conducting a real-time voice interview with a candidate. Your goal is to assess their qualifications, motivation, and fit for the role.

// Interview Guidelines:
// Follow the structured question flow:
// {{questions}}

// Engage naturally & react appropriately:
// Listen actively to responses and acknowledge them before moving forward.
// Ask brief follow-up questions if a response is vague or requires more detail.
// Keep the conversation flowing smoothly while maintaining control.
// Be professional, yet warm and welcoming:

// Use official yet friendly language.
// Keep responses concise and to the point (like in a real voice interview).
// Avoid robotic phrasing—sound natural and conversational.
// Answer the candidate’s questions professionally:

// If asked about the role, company, or expectations, provide a clear and relevant answer.
// If unsure, redirect the candidate to HR for more details.

// Conclude the interview properly:
// Thank the candidate for their time.
// Inform them that the company will reach out soon with feedback.
// End the conversation on a polite and positive note.


// - Be sure to be professional and polite.
// - Keep all your responses short and simple. Use official language, but be kind and welcoming.
// - This is a voice conversation, so keep your responses short, like in a real conversation. Don't ramble for too long.`,
//       },
//     ],
//   },
// };

export const feedbackSchema = z.object({
  totalScore: z.number(),
  categoryScores: z.tuple([
    z.object({
      name: z.literal("Communication Skills"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Technical Knowledge"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Problem Solving"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Cultural Fit"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Confidence and Clarity"),
      score: z.number(),
      comment: z.string(),
    }),
  ]),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});

export const interviewCovers = [
  "/facebook.png",
  "/google.png",
  "/amazon.png",
  "/spotify.png",
  "/adobe.png",
  "/tcs.png",
  "/wipro.png",
  "/zoho.png",
  "/infosys.png",
  "/hcl.png",
  "/tech-mahindra.png",
  "/mindtree.png",
  "/freshworks.png",
  "/swiggy.png",
  "/ola.png",
  "/paytm.png",
  "/zomato.png"
];


export const interviewCardsData: Interview[] = [
  {
    id: "1",
    userId: "famous",
    company: "facebook",
    role: "React Frontend Developer",
    type: "Technical",
    techstack: ["HTML", "CSS", "JavaScript", "React", "Redux", "TypeScript", "Tailwind CSS"]
  },
  {
    id: "2",
    userId: "famous",
    company: "google",
    role: "Spring Boot Backend Developer",
    type: "Technical",
    techstack: ["Java", "Spring Boot", "Hibernate", "MySQL", "JPA", "Maven"]
  },
  {
    id: "3",
    userId: "famous",
    company: "amazon",
    role: "AWS DevOps Engineer",
    type: "Mixed",
    techstack: ["AWS", "Docker", "Terraform", "Jenkins", "EC2", "S3"]
   },
  {
    id: "4",
    userId: "famous",
    company: "spotify",
    role: "Data Scientist",
    type: "Technical",
    techstack: ["Python", "Pandas", "NumPy", "Matplotlib", "Scikit-learn", "SQL"]
  },
  {
    id: "5",
    userId: "famous",
    company: "adobe",
    role: "UI Designer",
    type: "Behavioral",
    techstack: ["Figma", "Sketch", "Adobe XD", "Wireframes", "Design Systems"]
  },
  {
    id: "6",
    userId: "famous",
    company: "tcs",
    role: "Angular Frontend Developer",
    type: "Technical",
    techstack: ["HTML", "CSS", "TypeScript", "Angular", "RxJS", "Bootstrap"]
  },
  {
    id: "7",
    userId: "famous",
    company: "wipro",
    role: "Django Backend Developer",
    type: "Technical",
    techstack: ["Python", "Django", "PostgreSQL", "SQLite", "Django REST Framework"]
  },
  {
    id: "8",
    userId: "famous",
    company: "zoho",
    role: "MERN Stack Developer",
    type: "Mixed",
    techstack: ["MongoDB", "Express.js", "React", "Node.js", "Redux", "JWT"]
  },
  // {
  //   id: "9",
  //   userId: "user1",
  //   company: "infosys",
  //   role: "Automation Test Engineer",
  //   type: "Technical",
  //   techstack: ["Selenium", "Cypress", "Python", "Java", "Appium", "Postman"]
  // },
   {
    id: "10",
    userId: "famous",
    company: "zomato",
    role: "Data Analyst",
    type: "Mixed",
    techstack: ["Excel", "SQL", "Power BI", "Tableau", "Python"]
  },
  {
    id: "11",
    userId: "famous",
    company: "facebook",
    role: "Blockchain Developer",
    type: "Technical",
    techstack: ["Solidity", "Ethereum", "Web3.js", "Hardhat", "Metamask"]
  },
   {
    id: "12",
    userId: "famous",
    company: "google",
    role: "ML Engineer",
    type: "Technical",
    techstack: ["Python", "TensorFlow", "Keras", "PyTorch", "Scikit-learn", "MLflow"]
  },
  {
    id: "13",
    userId: "famous",
    company: "amazon",
    role: "Cybersecurity Engineer",
    type: "Technical",
    techstack: ["Kali Linux", "Wireshark", "Metasploit", "Burp Suite", "Firewalls"]
  },
   {
    id: "14",
    userId: "famous",
    company: "tcs",
    role: "Linux System Administrator",
    type: "Technical",
    techstack: ["Linux", "Shell Scripting", "Nginx", "Apache", "Bash"]
  },
  {
    id: "15",
    userId: "famous",
    company: "wipro",
    role: "Vue Frontend Developer",
    type: "Technical",
    techstack: ["HTML", "CSS", "JavaScript", "Vue.js", "Vuex", "Vuetify"]
  },
  {
    id: "16",
    userId: "famous",
    company: "zoho",
    role: "iOS Developer",
    type: "Mixed",
    techstack: ["Swift", "Xcode", "SwiftUI", "CocoaPods"]
  },
  //  {
  //   id: "17",
  //   userId: "user1",
  //   company: "infosys",
  //   role: "Google Cloud DevOps Engineer",
  //   type: "Technical",
  //   techstack: ["GCP", "Kubernetes", "Docker", "Cloud Functions"]
  // }
];

export const getFamousInterviewById = (id: string): Interview | undefined => {
  return interviewCardsData.find((interview) => interview.id === id);
};




