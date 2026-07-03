export const brand = {
  name: 'KALARANG',
  subtitle: 'Silks & Studio',
  tagline: 'The House of Colors',
  motto: 'Where every fabric tells a story.',
  closingLine: 'Where every creation celebrates you.',
};

export const hero = {
  eyebrow: 'The House of Colors',
  headline: 'Where Tradition Meets Creativity',
  subtext:
    'Transforming sarees, fabrics, and ideas into timeless creations that celebrate your individuality.',
  body: 'At KalaRang, we bring together curated sarees, hand-painted artistry, fabric printing, custom tailoring, and creative design solutions to help every woman express her unique style. Whether you\'re looking for a beautiful saree, a custom outfit, or a cherished heirloom transformed into something new, we craft every piece with passion, precision, and purpose.',
  closing: 'Because every fabric has a story. Every woman deserves her own.',
  primaryCta: { label: 'Book a Consultation', href: '/contact' },
  secondaryCta: { label: 'Explore Our Collections', href: '/collections/all' },
};

export const heroSlides = [
  {
    id: 'banarasi-brocade',
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=80',
    pattern: 'Banarasi Brocade',
    tagline: 'Zari jaal woven through pure silk',
    patternClass: 'hero-pattern-brocade',
  },
  {
    id: 'kanjivaram-temple',
    image:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1400&q=80',
    pattern: 'Kanjivaram Temple Border',
    tagline: 'Contrast borders & temple motifs',
    patternClass: 'hero-pattern-temple',
  },
  {
    id: 'paisley-jaal',
    image:
      'https://images.unsplash.com/photo-1610030469854-2c069b3f3b90?auto=format&fit=crop&w=1400&q=80',
    pattern: 'Paisley Jaal',
    tagline: 'Classic mango motifs in flowing repeat',
    patternClass: 'hero-pattern-paisley',
  },
  {
    id: 'chanderi-buti',
    image:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1400&q=80',
    pattern: 'Chanderi Buti',
    tagline: 'Delicate florals on sheer cotton-silk',
    patternClass: 'hero-pattern-buti',
  },
  {
    id: 'peacock-paithani',
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1400&q=80',
    pattern: 'Peacock Paithani',
    tagline: 'Heritage pallu with jewel-toned weave',
    patternClass: 'hero-pattern-peacock',
  },
] as const;

export const about = {
  eyebrow: 'About KalaRang',
  title: 'The Story Behind KalaRang',
  intro:
    'KalaRang was born from a simple belief — every woman deserves to wear something that feels uniquely hers.',
  paragraphs: [
    'What started as a passion for colors, fabrics, painting, and design evolved into a creative space where traditional craftsmanship meets personal expression. We understood that many women wanted customized, meaningful fashion without the complexity and high costs often associated with designer wear.',
    'Our mission is to make personalized fashion accessible through thoughtfully curated sarees, artistic hand painting, fabric printing, custom tailoring, and affordable stitching solutions.',
    'At KalaRang, fashion is not just about clothing. It is about confidence, identity, celebration, and self-expression. Every piece we create is designed to reflect the personality, memories, and aspirations of the woman who wears it.',
    'Today, KalaRang continues to transform fabrics into stories and designs into cherished memories.',
  ],
  teaser:
    'KalaRang was born from a simple belief — every woman deserves to wear something that feels uniquely hers. We bring together curated sarees, hand-painted artistry, fabric printing, and custom tailoring to help every woman express her unique style.',
};

export const services = [
  {
    id: 'saree-collection',
    title: 'Saree Collection',
    description:
      'Discover a carefully curated range of sarees that celebrate elegance, tradition, and contemporary style. From everyday wear to festive and occasion collections, each saree is selected for its beauty, quality, and uniqueness.',
    listLabel: 'We Offer:',
    items: [
      'Silk Sarees',
      'Designer Sarees',
      'Festive Collections',
      'Handcrafted Selections',
      'Exclusive Limited Editions',
    ],
    cta: { label: 'Explore Collections', href: '/collections/all' },
  },
  {
    id: 'hand-painting',
    title: 'Hand Painting on Sarees & Fabrics',
    description:
      'Turn your saree into a wearable masterpiece. Our artists create custom hand-painted designs inspired by nature, heritage motifs, personal stories, and contemporary art.',
    listLabel: 'Popular Themes:',
    items: [
      'Floral Art',
      'Traditional Motifs',
      'Customized Portraits',
      'Wedding Themes',
      'Temple Art',
      'Contemporary Designs',
    ],
    footnote: 'Every hand-painted creation is uniquely crafted and impossible to replicate.',
    cta: { label: 'Book a Consultation', href: '/contact?service=hand-painting' },
  },
  {
    id: 'fabric-printing',
    title: 'Fabric Printing',
    description:
      'Give your existing sarees and fabrics a fresh new identity. Our fabric printing services allow you to personalize textiles with elegant patterns, artistic designs, and custom concepts that reflect your style.',
    listLabel: 'Ideal For:',
    items: [
      'Revamping Old Sarees',
      'Personalized Gifts',
      'Designer Blouses',
      'Event Wear',
      'Customized Family Outfits',
    ],
    cta: { label: 'Book a Consultation', href: '/contact?service=fabric-printing' },
  },
  {
    id: 'custom-tailoring',
    title: 'Custom Tailoring & Stitching',
    description:
      'Fashion should fit you perfectly. At KalaRang, we specialize in custom tailoring that combines comfort, style, and precision. Our experienced designers work closely with you to create outfits that complement your personality and body type.',
    listLabel: 'We Stitch:',
    items: [
      'Blouses',
      'Salwar Suits',
      'Kurtis',
      'Lehengas',
      'Indo-Western Wear',
      'Occasion Wear',
    ],
    cta: { label: 'Book a Consultation', href: '/contact?service=custom-tailoring' },
  },
  {
    id: 'heirloom-transformation',
    title: 'Heirloom Transformation',
    description:
      'Preserve memories. Create new stories. We transform treasured sarees belonging to mothers, grandmothers, and loved ones into contemporary outfits while preserving their emotional value.',
    listLabel: 'Transform Into:',
    items: [
      'Kurtis',
      'Gowns',
      'Lehengas',
      'Jackets',
      "Children's Wear",
      'Keepsake Accessories',
    ],
    footnote: 'Because some memories deserve to be worn forever.',
    cta: { label: 'Book a Consultation', href: '/contact?service=heirloom-transformation' },
  },
];

export const whyChoose = {
  title: 'Why Choose KalaRang?',
  pillars: [
    {
      title: 'Personalized Designs',
      description: 'Every creation is tailored to your vision, preferences, and personality.',
    },
    {
      title: 'Artistic Excellence',
      description: 'Combining traditional craftsmanship with contemporary creativity.',
    },
    {
      title: 'Affordable Luxury',
      description: 'Premium quality without premium pricing.',
    },
    {
      title: 'Attention to Detail',
      description: 'Every stitch, brushstroke, and design element is thoughtfully executed.',
    },
    {
      title: 'One-Stop Creative Studio',
      description: 'From fabric selection to final stitching, everything happens under one roof.',
    },
    {
      title: 'Customer-Centric Approach',
      description: 'We believe in listening, understanding, and creating exactly what our customers envision.',
    },
  ],
};

export const founder = {
  eyebrow: 'Meet Our Founder',
  name: 'Soumya Naveen',
  title: 'Founder, KalaRang Silks & Studios',
  intro:
    "KalaRang is the realization of Soumya's lifelong love for sarees, textiles, colors, and design.",
  paragraphs: [
    "As a child, she found herself fascinated by her mother's and grandmother's sarees—their textures, colors, and the stories they carried. That fascination evolved into a passion for fashion, textile artistry, and personalized design.",
    'An MBA graduate and proud alumna of CHRIST University, Soumya combines creative vision with entrepreneurial excellence. Through KalaRang, she aims to preserve textile traditions while helping women embrace their individuality through meaningful, customized fashion.',
  ],
  vision:
    'To create designs that preserve memories, celebrate individuality, and make every woman feel confident in her own unique style.',
  teaser:
    'Soumya Naveen founded KalaRang to preserve textile traditions while helping women embrace their individuality through meaningful, customized fashion.',
  imageUrl: '/sowmya.jpeg',
};

export const process = {
  title: 'Our Process',
  steps: [
    { step: 1, title: 'Consultation', description: 'Understand your vision, preferences, and requirements.' },
    { step: 2, title: 'Design Discussion', description: 'Collaborate on concepts, fabrics, artwork, and styling.' },
    { step: 3, title: 'Creation', description: 'Our artisans and designers bring your ideas to life.' },
    { step: 4, title: 'Fittings & Finishing', description: 'Perfect tailoring and quality checks.' },
    { step: 5, title: 'Delivery', description: 'A beautiful creation crafted exclusively for you.' },
  ],
};

export const testimonials = {
  title: 'What Our Customers Say',
  quotes: [
    "KalaRang transformed my mother's wedding saree into a beautiful contemporary outfit that I will treasure forever.",
    'The attention to detail and creativity exceeded my expectations.',
    'I finally found a place where custom fashion feels personal, affordable, and stress-free.',
  ],
};

export const cta = {
  title: "Let's Create Something Beautiful Together",
  description:
    "Whether you're looking for a unique saree, custom tailoring, hand-painted artistry, or a meaningful heirloom transformation, KalaRang is here to bring your vision to life.",
  buttons: [
    { label: 'Visit Our Studio', href: '/contact' },
    { label: 'Book a Design Consultation', href: '/contact' },
    { label: 'Explore Our Collections', href: '/collections/all' },
  ],
};

export const contact = {
  title: 'Get in Touch',
  subtitle: 'Book a Design Consultation',
  description:
    'Share your vision with us and we will connect with you on WhatsApp to discuss your requirements.',
  email: 'studio@kalarang.com',
};

export const consultationServices = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'saree-collection', label: 'Saree Collection' },
  { value: 'hand-painting', label: 'Hand Painting' },
  { value: 'fabric-printing', label: 'Fabric Printing' },
  { value: 'custom-tailoring', label: 'Custom Tailoring' },
  { value: 'heirloom-transformation', label: 'Heirloom Transformation' },
];

export const aboutValues = {
  title: 'Our Values',
  items: [
    {
      title: 'Personal Expression',
      description: 'Every piece reflects the personality, memories, and aspirations of the woman who wears it.',
    },
    {
      title: 'Accessible Luxury',
      description: 'Personalized fashion without the complexity and high costs of traditional designer wear.',
    },
    {
      title: 'Craft & Care',
      description: 'Traditional craftsmanship meets contemporary creativity in every creation.',
    },
  ],
};
