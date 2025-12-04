export type Language = "en" | "es" | "fr" | "hi" | "de" | "zh";

export interface Translations {
  nav: {
    home: string;
    categories: string;
    about: string;
    contact: string;
    login: string;
  };
  footer: {
    about: string;
    popularTopics: string;
    stayInLoop: string;
    newsletterDescription: string;
    subscribe: string;
    enterEmail: string;
    copyright: string;
    privacy: string;
    terms: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    featuredReading: string;
    featuredArticles: string;
    viewAll: string;
    latestBlogPosts: string;
    exploreAllCategories: string;
    stayUpdated: string;
    newsletterDescription: string;
    subscribe: string;
  };
  about: {
    title: string;
    subtitle: string;
    mission: string;
    whoWeAre: string;
    whatWeOffer: string;
    ourCommitment: string;
    joinCommunity: string;
    getInTouch: string;
  };
  contact: {
    title: string;
    subtitle: string;
    name: string;
    email: string;
    message: string;
    sendMessage: string;
    emailUs: string;
    responseTime: string;
    support: string;
  };
  categories: {
    title: string;
    subtitle: string;
    popularCategories: string;
    viewAll: string;
    articles: string;
    posts: string;
    popularDescription: string;
  };
  common: {
    readMore: string;
    readTime: string;
    minRead: string;
    publishedAt: string;
    author: string;
    relatedArticles: string;
    notFound: string;
    pageNotFound: string;
    goHome: string;
    thumbnail: string;
    moreHashtags: string;
  };
  notFound: {
    title: string;
    heading: string;
    description: string;
    ctaTitle: string;
    ctaDescription: string;
    exploreTitle: string;
    backToHome: string;
  };
  login: {
    badge: string;
    title: string;
    subtitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    button: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: "Home",
      categories: "Categories",
      about: "About",
      contact: "Contact",
      login: "Log in",
    },
    footer: {
      about: "About The Modern Quill",
      popularTopics: "Popular Topics",
      stayInLoop: "Stay in the Loop",
      newsletterDescription: "Join our newsletter to receive curated reading lists and fresh articles each week.",
      subscribe: "Subscribe",
      enterEmail: "Enter your email",
      copyright: "All rights reserved.",
      privacy: "Privacy",
      terms: "Terms",
    },
    home: {
      heroTitle: "Discover Expert Insights Across 30+ Categories",
      heroSubtitle: "Explore thousands of well-researched articles with high-quality images, covering everything from technology and AI to business, health, travel, and more. Discover insights, tips, and stories that matter to you.",
      featuredReading: "Featured reading",
      featuredArticles: "Featured Articles",
      viewAll: "View All",
      latestBlogPosts: "Latest Blog Posts",
      exploreAllCategories: "Explore All Categories",
      stayUpdated: "Stay Updated",
      newsletterDescription: "Get the latest articles delivered to your inbox. Stay informed with fresh content every day.",
      subscribe: "Subscribe",
    },
    about: {
      title: "About The Modern Quill",
      subtitle: "Your trusted source for expert insights, well-researched articles, and valuable knowledge across 30+ categories, curated by professionals passionate about sharing expertise.",
      mission: "Our Mission",
      whoWeAre: "Who We Are",
      whatWeOffer: "What We Offer",
      ourCommitment: "Our Commitment",
      joinCommunity: "Join Our Community",
      getInTouch: "Get in Touch",
    },
    contact: {
      title: "Contact the Editorial Team",
      subtitle: "Have a question, suggestion, or want to collaborate? We'd love to hear from you. Send us a message and we'll get back to you as soon as possible.",
      name: "Your Name",
      email: "Email Address",
      message: "Your Message",
      sendMessage: "Send Message",
      emailUs: "Email Us",
      responseTime: "Response Time",
      support: "Support",
    },
    categories: {
      title: "Explore topics",
      subtitle: "Browse all categories available on The Modern Quill. Each topic section contains well-researched articles written by experts in their fields.",
      popularCategories: "Popular Categories",
      viewAll: "View All 30+ Categories",
      articles: "articles",
      posts: "posts",
      popularDescription: "Readers are spending the most time exploring these categories right now.",
    },
    common: {
      readMore: "Read More",
      readTime: "Read Time",
      minRead: "min read",
      publishedAt: "Published",
      author: "Author",
      relatedArticles: "Related Articles",
      notFound: "Not Found",
      pageNotFound: "Page Not Found",
      goHome: "Go Home",
      thumbnail: "Thumbnail",
      moreHashtags: "more",
    },
    notFound: {
      title: "404",
      heading: "Page Not Found",
      description: "Oops! The page you're looking for doesn't exist. But don't worry—we have plenty of amazing blogs waiting for you to explore.",
      ctaTitle: "What would you like to read?",
      ctaDescription: "Browse our 30+ categories and discover articles that interest you",
      exploreTitle: "Explore All Categories",
      backToHome: "Back to Home",
    },
    login: {
      badge: "Login",
      title: "Welcome back",
      subtitle: "Enter your email to continue. In a later version this page will be wired to a real authentication system.",
      emailLabel: "Email address",
      emailPlaceholder: "you@example.com",
      button: "Continue with email (static)",
    },
  },
  es: {
    nav: {
      home: "Inicio",
      categories: "Categorías",
      about: "Acerca de",
      contact: "Contacto",
      login: "Iniciar sesión",
    },
    footer: {
      about: "Acerca de The Modern Quill",
      popularTopics: "Temas Populares",
      stayInLoop: "Mantente al Día",
      newsletterDescription: "Únete a nuestro boletín para recibir listas de lectura curadas y artículos frescos cada semana.",
      subscribe: "Suscribirse",
      enterEmail: "Ingresa tu correo",
      copyright: "Todos los derechos reservados.",
      privacy: "Privacidad",
      terms: "Términos",
    },
    home: {
      heroTitle: "Descubre Perspectivas Expertas en Más de 30 Categorías",
      heroSubtitle: "Explora miles de artículos bien investigados con imágenes de alta calidad, que cubren todo desde tecnología e IA hasta negocios, salud, viajes y más. Descubre perspectivas, consejos e historias que te importan.",
      featuredReading: "Lectura destacada",
      featuredArticles: "Artículos Destacados",
      viewAll: "Ver Todo",
      latestBlogPosts: "Últimas Publicaciones",
      exploreAllCategories: "Explorar Todas las Categorías",
      stayUpdated: "Mantente Actualizado",
      newsletterDescription: "Recibe los últimos artículos en tu bandeja de entrada. Mantente informado con contenido fresco todos los días.",
      subscribe: "Suscribirse",
    },
    about: {
      title: "Acerca de The Modern Quill",
      subtitle: "Tu fuente confiable de perspectivas expertas, artículos bien investigados y conocimiento valioso en más de 30 categorías, curados por profesionales apasionados por compartir su experiencia.",
      mission: "Nuestra Misión",
      whoWeAre: "Quiénes Somos",
      whatWeOffer: "Lo Que Ofrecemos",
      ourCommitment: "Nuestro Compromiso",
      joinCommunity: "Únete a Nuestra Comunidad",
      getInTouch: "Contáctanos",
    },
    contact: {
      title: "Contacta al Equipo Editorial",
      subtitle: "¿Tienes una pregunta, sugerencia o quieres colaborar? Nos encantaría saber de ti. Envíanos un mensaje y te responderemos lo antes posible.",
      name: "Tu Nombre",
      email: "Correo Electrónico",
      message: "Tu Mensaje",
      sendMessage: "Enviar Mensaje",
      emailUs: "Escríbenos",
      responseTime: "Tiempo de Respuesta",
      support: "Soporte",
    },
    categories: {
      title: "Explorar temas",
      subtitle: "Navega por todas las categorías disponibles en The Modern Quill. Cada sección de tema contiene artículos bien investigados escritos por expertos en sus campos.",
      popularCategories: "Categorías Populares",
      viewAll: "Ver Todas las 30+ Categorías",
      articles: "artículos",
      posts: "publicaciones",
      popularDescription: "Los lectores están pasando más tiempo explorando estas categorías ahora mismo.",
    },
    common: {
      readMore: "Leer Más",
      readTime: "Tiempo de Lectura",
      minRead: "min de lectura",
      publishedAt: "Publicado",
      author: "Autor",
      relatedArticles: "Artículos Relacionados",
      notFound: "No Encontrado",
      pageNotFound: "Página No Encontrada",
      goHome: "Ir al Inicio",
      thumbnail: "Miniatura",
      moreHashtags: "más",
    },
    notFound: {
      title: "404",
      heading: "Página No Encontrada",
      description: "¡Ups! La página que buscas no existe. Pero no te preocupes—tenemos muchos blogs increíbles esperando que explores.",
      ctaTitle: "¿Qué te gustaría leer?",
      ctaDescription: "Navega por nuestras 30+ categorías y descubre artículos que te interesen",
      exploreTitle: "Explorar Todas las Categorías",
      backToHome: "Volver al Inicio",
    },
    login: {
      badge: "Iniciar sesión",
      title: "Bienvenido de nuevo",
      subtitle: "Ingresa tu correo para continuar. En una versión posterior esta página estará conectada a un sistema de autenticación real.",
      emailLabel: "Correo electrónico",
      emailPlaceholder: "tu@ejemplo.com",
      button: "Continuar con correo (estático)",
    },
  },
  fr: {
    nav: {
      home: "Accueil",
      categories: "Catégories",
      about: "À propos",
      contact: "Contact",
      login: "Se connecter",
    },
    footer: {
      about: "À propos de The Modern Quill",
      popularTopics: "Sujets Populaires",
      stayInLoop: "Restez Informé",
      newsletterDescription: "Rejoignez notre newsletter pour recevoir des listes de lecture sélectionnées et des articles frais chaque semaine.",
      subscribe: "S'abonner",
      enterEmail: "Entrez votre email",
      copyright: "Tous droits réservés.",
      privacy: "Confidentialité",
      terms: "Conditions",
    },
    home: {
      heroTitle: "Découvrez des Perspectives d'Experts dans Plus de 30 Catégories",
      heroSubtitle: "Explorez des milliers d'articles bien recherchés avec des images de haute qualité, couvrant tout de la technologie et de l'IA aux affaires, à la santé, aux voyages et plus encore. Découvrez des perspectives, des conseils et des histoires qui vous importent.",
      featuredReading: "Lecture recommandée",
      featuredArticles: "Articles en Vedette",
      viewAll: "Voir Tout",
      latestBlogPosts: "Derniers Articles",
      exploreAllCategories: "Explorer Toutes les Catégories",
      stayUpdated: "Restez à Jour",
      newsletterDescription: "Recevez les derniers articles dans votre boîte de réception. Restez informé avec du contenu frais chaque jour.",
      subscribe: "S'abonner",
    },
    about: {
      title: "À propos de The Modern Quill",
      subtitle: "Votre source fiable de perspectives d'experts, d'articles bien recherchés et de connaissances précieuses dans plus de 30 catégories, organisés par des professionnels passionnés par le partage d'expertise.",
      mission: "Notre Mission",
      whoWeAre: "Qui Nous Sommes",
      whatWeOffer: "Ce Que Nous Offrons",
      ourCommitment: "Notre Engagement",
      joinCommunity: "Rejoignez Notre Communauté",
      getInTouch: "Contactez-nous",
    },
    contact: {
      title: "Contacter l'Équipe Éditoriale",
      subtitle: "Vous avez une question, une suggestion ou souhaitez collaborer? Nous serions ravis d'avoir de vos nouvelles. Envoyez-nous un message et nous vous répondrons dans les plus brefs délais.",
      name: "Votre Nom",
      email: "Adresse Email",
      message: "Votre Message",
      sendMessage: "Envoyer le Message",
      emailUs: "Écrivez-nous",
      responseTime: "Temps de Réponse",
      support: "Support",
    },
    categories: {
      title: "Explorer les sujets",
      subtitle: "Parcourez toutes les catégories disponibles sur The Modern Quill. Chaque section de sujet contient des articles bien recherchés écrits par des experts dans leurs domaines.",
      popularCategories: "Catégories Populaires",
      viewAll: "Voir Toutes les 30+ Catégories",
      articles: "articles",
      posts: "articles",
      popularDescription: "Les lecteurs passent le plus de temps à explorer ces catégories en ce moment.",
    },
    common: {
      readMore: "Lire Plus",
      readTime: "Temps de Lecture",
      minRead: "min de lecture",
      publishedAt: "Publié",
      author: "Auteur",
      relatedArticles: "Articles Connexes",
      notFound: "Non Trouvé",
      pageNotFound: "Page Non Trouvée",
      goHome: "Aller à l'Accueil",
      thumbnail: "Miniature",
      moreHashtags: "plus",
    },
    notFound: {
      title: "404",
      heading: "Page Non Trouvée",
      description: "Oups! La page que vous recherchez n'existe pas. Mais ne vous inquiétez pas—nous avons beaucoup de blogs incroyables qui vous attendent.",
      ctaTitle: "Que souhaitez-vous lire?",
      ctaDescription: "Parcourez nos 30+ catégories et découvrez des articles qui vous intéressent",
      exploreTitle: "Explorer Toutes les Catégories",
      backToHome: "Retour à l'Accueil",
    },
    login: {
      badge: "Connexion",
      title: "Bon retour",
      subtitle: "Entrez votre email pour continuer. Dans une version ultérieure, cette page sera connectée à un système d'authentification réel.",
      emailLabel: "Adresse email",
      emailPlaceholder: "vous@exemple.com",
      button: "Continuer avec email (statique)",
    },
  },
  hi: {
    nav: {
      home: "होम",
      categories: "श्रेणियाँ",
      about: "के बारे में",
      contact: "संपर्क",
      login: "लॉग इन",
    },
    footer: {
      about: "The Modern Quill के बारे में",
      popularTopics: "लोकप्रिय विषय",
      stayInLoop: "अपडेट रहें",
      newsletterDescription: "सप्ताह में एक बार चयनित पठन सूचियाँ और नए लेख प्राप्त करने के लिए हमारे न्यूज़लेटर में शामिल हों।",
      subscribe: "सदस्यता लें",
      enterEmail: "अपना ईमेल दर्ज करें",
      copyright: "सभी अधिकार सुरक्षित।",
      privacy: "गोपनीयता",
      terms: "नियम",
    },
    home: {
      heroTitle: "30+ श्रेणियों में विशेषज्ञ अंतर्दृष्टि खोजें",
      heroSubtitle: "उच्च-गुणवत्ता वाली छवियों के साथ हजारों अच्छी तरह से शोधित लेखों का अन्वेषण करें, जो प्रौद्योगिकी और AI से लेकर व्यापार, स्वास्थ्य, यात्रा और बहुत कुछ को कवर करते हैं। आपके लिए महत्वपूर्ण अंतर्दृष्टि, सुझाव और कहानियाँ खोजें।",
      featuredReading: "विशेष रीडिंग",
      featuredArticles: "विशेष लेख",
      viewAll: "सभी देखें",
      latestBlogPosts: "नवीनतम ब्लॉग पोस्ट",
      exploreAllCategories: "सभी श्रेणियाँ एक्सप्लोर करें",
      stayUpdated: "अपडेट रहें",
      newsletterDescription: "अपने इनबॉक्स में नवीनतम लेख प्राप्त करें। हर दिन ताज़ी सामग्री के साथ सूचित रहें।",
      subscribe: "सदस्यता लें",
    },
    about: {
      title: "The Modern Quill के बारे में",
      subtitle: "30+ श्रेणियों में विशेषज्ञ अंतर्दृष्टि, अच्छी तरह से शोधित लेख और मूल्यवान ज्ञान का आपका विश्वसनीय स्रोत, जो विशेषज्ञता साझा करने के लिए भावुक पेशेवरों द्वारा क्यूरेट किया गया है।",
      mission: "हमारा मिशन",
      whoWeAre: "हम कौन हैं",
      whatWeOffer: "हम क्या प्रदान करते हैं",
      ourCommitment: "हमारी प्रतिबद्धता",
      joinCommunity: "हमारे समुदाय में शामिल हों",
      getInTouch: "संपर्क करें",
    },
    contact: {
      title: "संपादकीय टीम से संपर्क करें",
      subtitle: "क्या आपके पास कोई प्रश्न, सुझाव है, या सहयोग करना चाहते हैं? हम आपसे सुनना पसंद करेंगे। हमें एक संदेश भेजें और हम जल्द से जल्द आपको जवाब देंगे।",
      name: "आपका नाम",
      email: "ईमेल पता",
      message: "आपका संदेश",
      sendMessage: "संदेश भेजें",
      emailUs: "हमें ईमेल करें",
      responseTime: "प्रतिक्रिया समय",
      support: "सहायता",
    },
    categories: {
      title: "विषयों का अन्वेषण करें",
      subtitle: "The Modern Quill पर उपलब्ध सभी श्रेणियों को ब्राउज़ करें। प्रत्येक विषय अनुभाग में उनके क्षेत्रों के विशेषज्ञों द्वारा लिखे गए अच्छी तरह से शोधित लेख शामिल हैं।",
      popularCategories: "लोकप्रिय श्रेणियाँ",
      viewAll: "सभी 30+ श्रेणियाँ देखें",
      articles: "लेख",
      posts: "पोस्ट",
      popularDescription: "पाठक अभी इन श्रेणियों का अन्वेषण करने में सबसे अधिक समय बिता रहे हैं।",
    },
    common: {
      readMore: "और पढ़ें",
      readTime: "पढ़ने का समय",
      minRead: "मिनट पढ़ें",
      publishedAt: "प्रकाशित",
      author: "लेखक",
      relatedArticles: "संबंधित लेख",
      notFound: "नहीं मिला",
      pageNotFound: "पृष्ठ नहीं मिला",
      goHome: "होम पर जाएँ",
      thumbnail: "थंबनेल",
      moreHashtags: "और",
    },
    notFound: {
      title: "404",
      heading: "पृष्ठ नहीं मिला",
      description: "ओह! जिस पृष्ठ की आप तलाश कर रहे हैं वह मौजूद नहीं है। लेकिन चिंता न करें—हमारे पास आपके लिए खोजने के लिए बहुत सारे अद्भुत ब्लॉग हैं।",
      ctaTitle: "आप क्या पढ़ना चाहेंगे?",
      ctaDescription: "हमारी 30+ श्रेणियों को ब्राउज़ करें और उन लेखों को खोजें जो आपकी रुचि रखते हैं",
      exploreTitle: "सभी श्रेणियाँ एक्सप्लोर करें",
      backToHome: "होम पर वापस जाएँ",
    },
    login: {
      badge: "लॉग इन",
      title: "वापसी पर स्वागत है",
      subtitle: "जारी रखने के लिए अपना ईमेल दर्ज करें। बाद के संस्करण में यह पृष्ठ एक वास्तविक प्रमाणीकरण प्रणाली से जुड़ा होगा।",
      emailLabel: "ईमेल पता",
      emailPlaceholder: "आप@उदाहरण.com",
      button: "ईमेल के साथ जारी रखें (स्थैतिक)",
    },
  },
  de: {
    nav: {
      home: "Startseite",
      categories: "Kategorien",
      about: "Über uns",
      contact: "Kontakt",
      login: "Anmelden",
    },
    footer: {
      about: "Über The Modern Quill",
      popularTopics: "Beliebte Themen",
      stayInLoop: "Bleiben Sie auf dem Laufenden",
      newsletterDescription: "Abonnieren Sie unseren Newsletter, um wöchentlich kuratierte Leselisten und frische Artikel zu erhalten.",
      subscribe: "Abonnieren",
      enterEmail: "E-Mail eingeben",
      copyright: "Alle Rechte vorbehalten.",
      privacy: "Datenschutz",
      terms: "Bedingungen",
    },
    home: {
      heroTitle: "Entdecken Sie Experteneinblicke in über 30 Kategorien",
      heroSubtitle: "Erkunden Sie Tausende von gut recherchierten Artikeln mit hochwertigen Bildern, die alles von Technologie und KI bis hin zu Business, Gesundheit, Reisen und mehr abdecken. Entdecken Sie Einblicke, Tipps und Geschichten, die für Sie wichtig sind.",
      featuredReading: "Empfohlene Lektüre",
      featuredArticles: "Ausgewählte Artikel",
      viewAll: "Alle anzeigen",
      latestBlogPosts: "Neueste Blog-Beiträge",
      exploreAllCategories: "Alle Kategorien erkunden",
      stayUpdated: "Bleiben Sie auf dem Laufenden",
      newsletterDescription: "Erhalten Sie die neuesten Artikel in Ihrem Postfach. Bleiben Sie täglich mit frischen Inhalten informiert.",
      subscribe: "Abonnieren",
    },
    about: {
      title: "Über The Modern Quill",
      subtitle: "Ihre vertrauenswürdige Quelle für Experteneinblicke, gut recherchierte Artikel und wertvolles Wissen in über 30 Kategorien, kuratiert von Fachleuten, die leidenschaftlich gerne ihr Fachwissen teilen.",
      mission: "Unsere Mission",
      whoWeAre: "Wer wir sind",
      whatWeOffer: "Was wir bieten",
      ourCommitment: "Unser Engagement",
      joinCommunity: "Treten Sie unserer Community bei",
      getInTouch: "Kontaktieren Sie uns",
    },
    contact: {
      title: "Kontaktieren Sie das Redaktionsteam",
      subtitle: "Haben Sie eine Frage, einen Vorschlag oder möchten Sie zusammenarbeiten? Wir würden gerne von Ihnen hören. Senden Sie uns eine Nachricht und wir werden uns so schnell wie möglich bei Ihnen melden.",
      name: "Ihr Name",
      email: "E-Mail-Adresse",
      message: "Ihre Nachricht",
      sendMessage: "Nachricht senden",
      emailUs: "E-Mail an uns",
      responseTime: "Antwortzeit",
      support: "Support",
    },
    categories: {
      title: "Themen erkunden",
      subtitle: "Durchsuchen Sie alle auf The Modern Quill verfügbaren Kategorien. Jeder Themenbereich enthält gut recherchierte Artikel, die von Experten auf ihren Gebieten geschrieben wurden.",
      popularCategories: "Beliebte Kategorien",
      viewAll: "Alle 30+ Kategorien anzeigen",
      articles: "Artikel",
      posts: "Beiträge",
      popularDescription: "Leser verbringen gerade die meiste Zeit damit, diese Kategorien zu erkunden.",
    },
    common: {
      readMore: "Weiterlesen",
      readTime: "Lesezeit",
      minRead: "Min. Lesezeit",
      publishedAt: "Veröffentlicht",
      author: "Autor",
      relatedArticles: "Verwandte Artikel",
      notFound: "Nicht gefunden",
      pageNotFound: "Seite nicht gefunden",
      goHome: "Zur Startseite",
      thumbnail: "Miniaturansicht",
      moreHashtags: "mehr",
    },
    notFound: {
      title: "404",
      heading: "Seite nicht gefunden",
      description: "Ups! Die Seite, die Sie suchen, existiert nicht. Aber keine Sorge—wir haben viele großartige Blogs, die darauf warten, dass Sie sie erkunden.",
      ctaTitle: "Was möchten Sie lesen?",
      ctaDescription: "Durchsuchen Sie unsere 30+ Kategorien und entdecken Sie Artikel, die Sie interessieren",
      exploreTitle: "Alle Kategorien erkunden",
      backToHome: "Zur Startseite",
    },
    login: {
      badge: "Anmelden",
      title: "Willkommen zurück",
      subtitle: "Geben Sie Ihre E-Mail ein, um fortzufahren. In einer späteren Version wird diese Seite mit einem echten Authentifizierungssystem verbunden.",
      emailLabel: "E-Mail-Adresse",
      emailPlaceholder: "sie@beispiel.com",
      button: "Mit E-Mail fortfahren (statisch)",
    },
  },
  zh: {
    nav: {
      home: "首页",
      categories: "分类",
      about: "关于",
      contact: "联系",
      login: "登录",
    },
    footer: {
      about: "关于 The Modern Quill",
      popularTopics: "热门话题",
      stayInLoop: "保持联系",
      newsletterDescription: "订阅我们的新闻通讯，每周接收精选阅读列表和新鲜文章。",
      subscribe: "订阅",
      enterEmail: "输入您的邮箱",
      copyright: "版权所有。",
      privacy: "隐私",
      terms: "条款",
    },
    home: {
      heroTitle: "在30多个类别中发现专家见解",
      heroSubtitle: "探索数千篇经过充分研究的文章，配有高质量图片，涵盖从技术和人工智能到商业、健康、旅行等各个方面。发现对您重要的见解、技巧和故事。",
      featuredReading: "精选阅读",
      featuredArticles: "精选文章",
      viewAll: "查看全部",
      latestBlogPosts: "最新博客文章",
      exploreAllCategories: "探索所有类别",
      stayUpdated: "保持更新",
      newsletterDescription: "将最新文章发送到您的收件箱。每天通过新鲜内容保持信息灵通。",
      subscribe: "订阅",
    },
    about: {
      title: "关于 The Modern Quill",
      subtitle: "您在30多个类别中获取专家见解、经过充分研究的文章和宝贵知识的可靠来源，由热衷于分享专业知识的专业人士策划。",
      mission: "我们的使命",
      whoWeAre: "我们是谁",
      whatWeOffer: "我们提供什么",
      ourCommitment: "我们的承诺",
      joinCommunity: "加入我们的社区",
      getInTouch: "联系我们",
    },
    contact: {
      title: "联系编辑团队",
      subtitle: "有问题、建议或想合作吗？我们很乐意听取您的意见。给我们发消息，我们会尽快回复您。",
      name: "您的姓名",
      email: "电子邮件地址",
      message: "您的消息",
      sendMessage: "发送消息",
      emailUs: "给我们发邮件",
      responseTime: "响应时间",
      support: "支持",
    },
    categories: {
      title: "探索主题",
      subtitle: "浏览 The Modern Quill 上提供的所有类别。每个主题部分都包含由各自领域的专家撰写的经过充分研究的文章。",
      popularCategories: "热门类别",
      viewAll: "查看所有30多个类别",
      articles: "文章",
      posts: "文章",
      popularDescription: "读者目前在这些类别上花费的时间最多。",
    },
    common: {
      readMore: "阅读更多",
      readTime: "阅读时间",
      minRead: "分钟阅读",
      publishedAt: "发布时间",
      author: "作者",
      relatedArticles: "相关文章",
      notFound: "未找到",
      pageNotFound: "页面未找到",
      goHome: "返回首页",
      thumbnail: "缩略图",
      moreHashtags: "更多",
    },
    notFound: {
      title: "404",
      heading: "页面未找到",
      description: "糟糕！您要查找的页面不存在。但别担心—我们有很多精彩的博客等着您探索。",
      ctaTitle: "您想读什么？",
      ctaDescription: "浏览我们的30多个类别，发现您感兴趣的文章",
      exploreTitle: "探索所有类别",
      backToHome: "返回首页",
    },
    login: {
      badge: "登录",
      title: "欢迎回来",
      subtitle: "输入您的邮箱以继续。在后续版本中，此页面将连接到真实的身份验证系统。",
      emailLabel: "电子邮件地址",
      emailPlaceholder: "您@示例.com",
      button: "使用邮箱继续（静态）",
    },
  },
};

export const languageNames: Record<Language, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  hi: "हिंदी",
  de: "Deutsch",
  zh: "中文",
};

