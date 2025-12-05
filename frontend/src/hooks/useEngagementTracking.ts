"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useApi } from "@/contexts/ApiContext";

/**
 * Hook for tracking user engagement (scrolls, clicks, views)
 */
export function useEngagementTracking() {
  const pathname = usePathname();
  const { trackPageScroll, trackUrlClick } = useApi();
  const scrollTracked = useRef(false);
  const maxScrollDepth = useRef(0);

  // Track page scrolls
  useEffect(() => {
    scrollTracked.current = false;
    maxScrollDepth.current = 0;

    const handleScroll = () => {
      if (typeof window === "undefined") return;

      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      const scrollDepth = Math.round(
        ((scrollTop + windowHeight) / documentHeight) * 100
      );

      // Update max scroll depth
      if (scrollDepth > maxScrollDepth.current) {
        maxScrollDepth.current = scrollDepth;
      }

      // Track at 25%, 50%, 75%, and 100% milestones
      if (!scrollTracked.current) {
        if (scrollDepth >= 25 && maxScrollDepth.current < 50) {
          trackPageScroll(pathname, 25);
          scrollTracked.current = true;
        } else if (scrollDepth >= 50 && maxScrollDepth.current < 75) {
          trackPageScroll(pathname, 50);
          scrollTracked.current = true;
        } else if (scrollDepth >= 75 && maxScrollDepth.current < 100) {
          trackPageScroll(pathname, 75);
          scrollTracked.current = true;
        } else if (scrollDepth >= 100) {
          trackPageScroll(pathname, 100);
          scrollTracked.current = true;
        }
      }

      // Reset tracking flag when scrolling back up
      if (scrollDepth < 25) {
        scrollTracked.current = false;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname, trackPageScroll]);

  // Track URL clicks (external links and internal navigation)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      
      if (link && link.href) {
        const url = link.href;
        const isExternal = !url.startsWith(window.location.origin);
        
        // Track all clicks, but prioritize external links
        if (isExternal || link.getAttribute("data-track") === "true") {
          trackUrlClick(url);
        }
      }
    };

    document.addEventListener("click", handleClick);
    
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [trackUrlClick]);
}

