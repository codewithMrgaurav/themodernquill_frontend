"use client";

import React, { createContext, useContext } from "react";
import staticContent from "@/data/static-content.json";

interface StaticContent {
  about: {
    badge: string;
    mission: {
      title: string;
      content: string;
    };
    whoWeAre: {
      title: string;
      engineers: {
        title: string;
        icon: string;
        description: string;
      };
      doctors: {
        title: string;
        icon: string;
        description: string;
      };
      otherProfessionals: string;
    };
    whatWeOffer: {
      title: string;
      features: Array<{
        title: string;
        description: string;
      }>;
    };
    commitment: {
      title: string;
      content: string;
    };
    community: {
      title: string;
      description: string;
      cta: string;
    };
  };
  contact: {
    badge: string;
    info: Array<{
      type: string;
      label: string;
      value: string;
      icon: string;
    }>;
    form: {
      namePlaceholder: string;
      emailPlaceholder: string;
      messagePlaceholder: string;
    };
  };
  categories: {
    badge: string;
    description: string;
    popularCategoriesTitle: string;
    popularCategoriesDescription: string;
    postsLabel: string;
    articlesLabel: string;
  };
  home: {
    hero: {
      badge: string;
      title: string;
      subtitle: string;
      badges: string[];
    };
    featured: {
      label: string;
      title: string;
      viewAll: string;
      thumbnailLabel: string;
      moreHashtags: string;
    };
    latest: {
      title: string;
    };
    newsletter: {
      title: string;
      description: string;
      button: string;
      placeholder: string;
    };
    exploreCategories: {
      title: string;
    };
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
  footer: {
    about: {
      badge: string;
      title: string;
      description: string;
    };
    popularTopics: {
      title: string;
      topics: string[];
    };
    newsletter: {
      title: string;
      description: string;
      placeholder: string;
      button: string;
    };
  };
}

interface ContentContextType {
  content: StaticContent;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  return (
    <ContentContext.Provider value={{ content: staticContent as StaticContent }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
}

