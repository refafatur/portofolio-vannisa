export interface ProfileData {
  nama: string;
  title: string;
  roles: string[];
  bio: string;
  aboutDesc: string;
  email: string;
  phone: string;
  location: string;
  age: string;
  freelance: string;
  avatarUrl: string;
  cvUrl: string;
  socials: {
    linkedin?: string;
    github?: string;
    instagram?: string;
    tiktok?: string;
  };
}

export function calculateAge(birthDateString = '2004-05-18'): number {
  const birthDate = new Date(birthDateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export const defaultProfile: ProfileData = {
  nama: 'Vannisa Maulvi',
  title: 'Data Analyst & Front-End Developer',
  roles: ['Data Analyst', 'Front-End Developer'],
  bio: 'A passionate professional bridging the gap between data insights and beautiful user interfaces.',
  aboutDesc: 'Hello, I am Vannisa Maulvi. I specialize in Data Analysis and Front-End Development, bringing analytical rigor to creative web solutions.',
  email: 'vannisamaulvi@gmail.com',
  phone: '+62 896-7742-1706',
  location: 'Bogor, Jawa Barat',
  age: String(calculateAge('2004-05-18')),
  freelance: 'Available',
  avatarUrl: '/image/me.png',
  cvUrl: '',
  socials: {
    linkedin: 'https://www.linkedin.com/in/vannisa-maulvi/',
    github: 'https://github.com/vannisamaulvi',
    instagram: 'https://www.instagram.com/vannisamaulvi/',
    tiktok: 'https://www.tiktok.com/@vannisamaulvi',
  },
};
