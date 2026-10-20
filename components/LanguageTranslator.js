"use client";

import { useEffect } from "react";
import { useSitePreferences } from "@/components/SitePreferences";

// Shared UI translations used across server-rendered and client-rendered pages.
// AboutContent already has its own full translation dictionary.
const AM = {
  Showing: "በማሳየት ላይ",
  of: "ከ",
  All: "ሁሉም",
  Home: "መነሻ",
  Destinations: "መዳረሻዎች",
  "Plan a trip": "ጉዞ ያቅዱ",
  About: "ስለ እኛ",
  Login: "ግባ",
  Register: "ይመዝገቡ",
  "My dashboard": "የእኔ ዳሽቦርድ",
  Notifications: "ማሳወቂያዎች",
  "Staff workspace": "የሰራተኛ ስራ ቦታ",
  Admin: "አስተዳዳሪ",
  "Sign out": "ውጣ",
  "Checking account…": "መለያውን በመፈተሽ ላይ…",
  Light: "ብርሃን",
  Dark: "ጨለማ",
  "Switch to light mode": "ወደ ብርሃን ሁነታ ቀይር",
  "Switch to dark mode": "ወደ ጨለማ ሁነታ ቀይር",
  "Skip to content": "ወደ ዋናው ይዘት ዝለል",
  "Discover thoughtfully. Travel respectfully.": "በጥንቃቄ ያስሱ። በአክብሮት ይጓዙ።",
  "Portfolio demonstration only. Destination information, access, and prices must be checked locally.":
    "ይህ የፕሮጀክት ማሳያ ብቻ ነው። የመዳረሻ መረጃ፣ መዳረሻ ፈቃድና ዋጋዎችን በአካባቢው ያረጋግጡ።",
  "ETHIOTOURISM · DISCOVER ETHIOPIA": "ኢትዮቱሪዝም · ኢትዮጵያን ያግኙ",
  "Find your own": "የራስዎን ልዩ ቦታ ያግኙ",
  "extraordinary.": "ድንቅ ተሞክሮ።",
  "Explore historic cities, highland landscapes, lakes, and living cultures across Ethiopia.":
    "በኢትዮጵያ ያሉ ታሪካዊ ከተሞችን፣ ደጋማ መልክዓ ምድሮችን፣ ሐይቆችንና ሕያው ባህሎችን ያስሱ።",
  "Explore destinations": "መዳረሻዎችን ያስሱ",
  "Create an account": "መለያ ይፍጠሩ",
  "START EXPLORING": "ማሰስ ይጀምሩ",
  "Discover Ethiopia": "ኢትዮጵያን ያግኙ",
  destinations: "መዳረሻዎች",
  "FIND YOUR WAY": "መንገድዎን ያግኙ",
  "Explore the map": "ካርታውን ያስሱ",
  "EXPLORE BY REGION": "በክልል ያስሱ",
  "12 destination groups": "12 የመዳረሻ ቡድኖች",
  "listed destinations": "የተዘረዘሩ መዳረሻዎች",
  "PLAN THOUGHTFULLY": "በጥንቃቄ ያቅዱ",
  "Make room for meaningful travel.": "ትርጉም ላለው ጉዞ ቦታ ይፍጠሩ።",
  "Save places you love, review your favorites, and prepare a trip inquiry.":
    "የሚወዷቸውን ቦታዎች ያስቀምጡ፣ ተወዳጆችዎን ይመልከቱ፣ የጉዞ ጥያቄም ያዘጋጁ።",
  "Open my dashboard": "የእኔን ዳሽቦርድ ክፈት",
  "THE COLLECTION": "የመዳረሻ ስብስብ",
  "Explore Ethiopian destinations": "የኢትዮጵያ መዳረሻዎችን ያስሱ",
  "Search places, choose a destination group, and open the map to explore their approximate locations.":
    "ቦታዎችን ይፈልጉ፣ የመዳረሻ ቡድን ይምረጡ፣ ግምታዊ አቀማመጣቸውን ለማየት ካርታውን ይክፈቱ።",
  "Search destinations": "መዳረሻዎችን ይፈልጉ",
  "Try Gondar, lake, or mountains": "ጎንደር፣ ሐይቅ ወይም ተራራ ይሞክሩ",
  "Destination group": "የመዳረሻ ቡድን",
  "All groups": "ሁሉም ቡድኖች",
  "No matching destinations": "የሚዛመድ መዳረሻ አልተገኘም",
  "Try another search or select all destination groups.":
    "ሌላ ፍለጋ ይሞክሩ ወይም ሁሉንም የመዳረሻ ቡድኖች ይምረጡ።",
  "Suggested duration:": "የሚመከር ቆይታ፦",
  "View details": "ዝርዝር ይመልከቱ",
  "Destination map": "የመዳረሻ ካርታ",
  "Suggested duration": "የሚመከር ቆይታ",
  "When to visit": "መቼ መጎብኘት እንደሚገባ",
  "Illustrative planning estimate": "ለእቅድ የተገመተ ዋጋ",
  Highlights: "ዋና ዋና መስህቦች",
  "Suggested itinerary": "የሚመከር የጉዞ ዕቅድ",
  "← All destinations": "← ወደ ሁሉም መዳረሻዎች",
  "WELCOME BACK": "እንኳን ደህና መጡ",
  "Sign in": "ይግቡ",
  "Sign in to manage your saved Ethiopian destinations.":
    "ያስቀመጧቸውን የኢትዮጵያ መዳረሻዎች ለማስተዳደር ይግቡ።",
  "Email address": "የኢሜይል አድራሻ",
  Password: "የይለፍ ቃል",
  "Signing in…": "በመግባት ላይ…",
  "Don't have an account?": "መለያ የለዎትም?",
  "Register here": "እዚህ ይመዝገቡ",
  "START YOUR JOURNEY": "ጉዞዎን ይጀምሩ",
  "Full name": "ሙሉ ስም",
  "Register to save favorite places and plan your travel.":
    "ተወዳጅ ቦታዎችን ለማስቀመጥና ጉዞዎን ለማቀድ ይመዝገቡ።",
  "Use at least 12 characters.": "ቢያንስ 12 ቁምፊዎችን ይጠቀሙ።",
  "Creating account…": "መለያ በመፍጠር ላይ…",
  "Already registered?": "አስቀድመው ተመዝግበዋል?",
  "Start planning your journey": "ጉዞዎን ማቀድ ይጀምሩ",
  "Tell us where you want to go and when you hope to travel.":
    "የት መሄድ እንደሚፈልጉና መቼ መጓዝ እንደሚያስቡ ይንገሩን።",
  "Sign in to plan a trip": "ጉዞ ለማቀድ ይግቡ",
  "Bookings are attached to your account so you can track status, receive notifications, and submit payment requests safely.":
    "ቦታ ማስያዣዎች ከመለያዎ ጋር ይያያዛሉ፤ ሁኔታቸውን ለመከታተል፣ ማሳወቂያ ለመቀበልና የክፍያ ጥያቄ በደህና ለማቅረብ።",
  "Sign in": "ይግቡ",
  "New to EthioTourism?": "አዲስ የEthioTourism ተጠቃሚ ነዎት?",
  "SECURE CHECKOUT": "ደህንነቱ የተጠበቀ ክፍያ",
  "Complete your booking": "ቦታ ማስያዣዎን ያጠናቅቁ",
  "Payments remain pending until verified. Never share your PIN or one-time password.":
    "ክፍያዎች እስኪረጋገጡ ድረስ በጥበቃ ሁኔታ ይቆያሉ። ፒንዎን ወይም የአንድ ጊዜ የይለፍ ቃልዎን ፈጽሞ አያጋሩ።",
  "Admin Dashboard": "የአስተዳዳሪ ዳሽቦርድ",
  Accounts: "መለያዎች",
  Bookings: "ቦታ ማስያዣዎች",
  "Pending payments": "በመጠባበቅ ላይ ያሉ ክፍያዎች",
  "Account roles": "የመለያ ሚናዎች",
  "Payment requests": "የክፍያ ጥያቄዎች",
  Customer: "ደንበኛ",
  Staff: "ሰራተኛ",
  Admin: "አስተዳዳሪ",
  "Change role": "ሚና ቀይር",
  "Mark verified": "እንደተረጋገጠ ምልክት አድርግ",
  Reject: "ውድቅ አድርግ",
  "No accounts loaded.": "ምንም መለያ አልተጫነም።",
  "No payment requests yet.": "እስካሁን የክፍያ ጥያቄ የለም።",
  "Loading administration data…": "የአስተዳደር መረጃ በመጫን ላይ…",
  "Open staff workspace": "የሰራተኛ ስራ ቦታ ክፈት",
  "View notifications": "ማሳወቂያዎችን ይመልከቱ",
  "Loading booking requests…": "የቦታ ማስያዣ ጥያቄዎችን በመጫን ላይ…",
  "No booking requests": "የቦታ ማስያዣ ጥያቄዎች የሉም",
  "New requests will appear here.": "አዲስ ጥያቄዎች እዚህ ይታያሉ።",
  Destination: "መዳረሻ",
  Customer: "ደንበኛ",
  Date: "ቀን",
  Travelers: "ተጓዦች",
  Amount: "መጠን",
  Status: "ሁኔታ",
  Update: "አዘምን",
  Pending: "በመጠባበቅ ላይ",
  Approved: "ተፈቅዷል",
  Cancelled: "ተሰርዟል",
  Completed: "ተጠናቋል",
  "Loading…": "በመጫን ላይ…",
  Loading: "በመጫን ላይ",
  Save: "አስቀምጥ",
  Cancel: "ሰርዝ",
  Search: "ፈልግ",
  Submit: "ላክ",
  Continue: "ቀጥል",
  Back: "ተመለስ",
  View: "ይመልከቱ",
  Favorites: "ተወዳጆች",
  "No notifications yet.": "እስካሁን ማሳወቂያ የለም።",
  "Amhara Region": "የአማራ ክልል",
  "Afar Region": "የአፋር ክልል",
  "Oromia Region": "የኦሮሚያ ክልል",
  "Sidama Region": "የሲዳማ ክልል",
  "South Ethiopia Region": "የደቡብ ኢትዮጵያ ክልል",
  "Central Ethiopia Region": "የመካከለኛው ኢትዮጵያ ክልል",
  "Tigray Region": "የትግራይ ክልል",
  Nature: "ተፈጥሮ",
  History: "ታሪክ",
  Culture: "ባህል",
  "Lake and culture": "ሐይቅና ባህል",
  "Local discovery": "የአካባቢ ግኝት",
  "Highlands and culture": "ደጋማ አካባቢና ባህል",
  "Bahir Dar and Lake Tana": "ባህር ዳርና ጣና ሐይቅ",
  "Blue Nile Falls (Tis Abay)": "የዓባይ ፏፏቴ (ጢስ ዓባይ)",
  "Gondar and Fasil Ghebbi": "ጎንደርና ፋሲል ግቢ",
  "Debre Markos": "ደብረ ማርቆስ",
  "Debre Dima": "ደብረ ዲማ",
  "Gish Abay": "ግሽ ዓባይ",
  Lalibela: "ላሊበላ",
  "Simien Mountains": "ሰሜን ተራሮች",
};

const textOriginals = new WeakMap();
const attributeOriginals = new WeakMap();

function translate(value) {
  const leading = value.match(/^\s*/)?.[0] || "";
  const trailing = value.match(/\s*$/)?.[0] || "";
  const core = value.slice(
    leading.length,
    value.length - trailing.length || undefined,
  );
  if (Object.prototype.hasOwnProperty.call(AM, core))
    return `${leading}${AM[core]}${trailing}`;
  // Translate known English phrases inside dynamic text while preserving numbers and spacing.
  let result = core;
  const keys = Object.keys(AM).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (key.length < 3 || key === core) continue;
    if (result.includes(key)) result = result.split(key).join(AM[key]);
  }
  return `${leading}${result}${trailing}`;
}

export default function LanguageTranslator() {
  const { language } = useSitePreferences();

  useEffect(() => {
    let scheduled = false;

    const apply = () => {
      scheduled = false;
      const root = document.body;
      if (!root) return;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        if (!node.nodeValue || !node.nodeValue.trim()) continue;
        const parentTag = node.parentElement?.tagName;
        if (
          ["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "INPUT"].includes(
            parentTag,
          )
        )
          continue;
        if (!textOriginals.has(node)) textOriginals.set(node, node.nodeValue);
        const original = textOriginals.get(node);
        const next = language === "am" ? translate(original) : original;
        if (node.nodeValue !== next) node.nodeValue = next;
      }

      const attrs = ["placeholder", "aria-label", "title", "alt"];
      root.querySelectorAll("*").forEach((element) => {
        for (const attr of attrs) {
          if (!element.hasAttribute(attr)) continue;
          let originals = attributeOriginals.get(element);
          if (!originals) {
            originals = {};
            attributeOriginals.set(element, originals);
          }
          if (!(attr in originals))
            originals[attr] = element.getAttribute(attr);
          const original = originals[attr];
          const next = language === "am" ? translate(original) : original;
          if (element.getAttribute(attr) !== next)
            element.setAttribute(attr, next);
        }
      });
    };

    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      queueMicrotask(apply);
    };

    apply();
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "aria-label", "title", "alt"],
    });
    return () => observer.disconnect();
  }, [language]);

  return null;
}
