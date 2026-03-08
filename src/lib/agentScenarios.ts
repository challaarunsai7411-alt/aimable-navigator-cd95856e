// Predefined demo scenarios that simulate the AI agent's behavior
export interface AgentStep {
  thought: string;
  action: string;
  element?: string;
  text?: string;
  status: "pending" | "running" | "done" | "warning";
  pageState?: PageState;
  result?: string;
}

export interface PageState {
  url: string;
  title: string;
  elements: PageElement[];
}

export interface PageElement {
  id: string;
  role: string;
  name: string;
  highlighted?: boolean;
}

export interface Scenario {
  command: string;
  goalPlan: {
    goal: string;
    parameters: Record<string, string | string[]>;
  };
  steps: AgentStep[];
  finalResult: string;
}

export const DEMO_SCENARIOS: Scenario[] = [
  {
    command: "Search Amazon for the cheapest wireless mouse",
    goalPlan: {
      goal: "search_product",
      parameters: {
        site: "amazon.com",
        query: "wireless mouse",
        constraints: ["lowest price", "sort by price"],
      },
    },
    steps: [
      {
        thought: "I need to navigate to Amazon's homepage to begin the search.",
        action: "navigate",
        text: "https://www.amazon.com",
        status: "pending",
        pageState: {
          url: "https://www.amazon.com",
          title: "Amazon.com",
          elements: [
            { id: "e1", role: "textbox", name: "Search Amazon", highlighted: true },
            { id: "e2", role: "button", name: "Search Submit" },
            { id: "e3", role: "link", name: "Today's Deals" },
            { id: "e4", role: "link", name: "Customer Service" },
          ],
        },
      },
      {
        thought: "I found the search box. I'll type the user's query.",
        action: "type",
        element: "e1",
        text: "wireless mouse",
        status: "pending",
      },
      {
        thought: "Query entered. Now I'll submit the search.",
        action: "click",
        element: "e2",
        status: "pending",
        pageState: {
          url: "https://www.amazon.com/s?k=wireless+mouse",
          title: "Amazon.com: wireless mouse",
          elements: [
            { id: "e5", role: "combobox", name: "Sort by", highlighted: true },
            { id: "e6", role: "link", name: "Logitech M185 - $12.99" },
            { id: "e7", role: "link", name: "Amazon Basics Mouse - $9.49" },
            { id: "e8", role: "link", name: "Razer DeathAdder - $29.99" },
          ],
        },
      },
      {
        thought: "Results loaded. I need to sort by price to find the cheapest option.",
        action: "select",
        element: "e5",
        text: "Price: Low to High",
        status: "pending",
      },
      {
        thought: "Page sorted. Extracting top results for the user.",
        action: "extract",
        status: "pending",
        result: "Top results found. Compiling cheapest options...",
        pageState: {
          url: "https://www.amazon.com/s?k=wireless+mouse&s=price-asc",
          title: "Amazon.com: wireless mouse - Price Low to High",
          elements: [
            { id: "e9", role: "link", name: "Generic 2.4G Mouse - $5.99", highlighted: true },
            { id: "e10", role: "link", name: "Amazon Basics Mouse - $9.49", highlighted: true },
            { id: "e11", role: "link", name: "Logitech M185 - $12.99", highlighted: true },
          ],
        },
      },
    ],
    finalResult:
      "Here are the 3 cheapest wireless mice on Amazon:\n\n1. **Generic 2.4G Wireless Mouse** — $5.99 ⭐ 3.8/5 (2,400 reviews)\n2. **Amazon Basics Wireless Mouse** — $9.49 ⭐ 4.3/5 (45,000 reviews)\n3. **Logitech M185** — $12.99 ⭐ 4.5/5 (120,000 reviews)\n\nThe Amazon Basics mouse offers the best balance of price and rating.",
  },
  {
    command: "Find the cheapest direct flight to London tomorrow",
    goalPlan: {
      goal: "search_flights",
      parameters: {
        destination: "London",
        date: "tomorrow",
        constraints: ["direct flights", "lowest price"],
      },
    },
    steps: [
      {
        thought: "I'll use Google Flights for the best flight comparison.",
        action: "navigate",
        text: "https://www.google.com/flights",
        status: "pending",
        pageState: {
          url: "https://www.google.com/flights",
          title: "Google Flights",
          elements: [
            { id: "f1", role: "textbox", name: "Where from?" },
            { id: "f2", role: "textbox", name: "Where to?", highlighted: true },
            { id: "f3", role: "textbox", name: "Departure date" },
            { id: "f4", role: "button", name: "Search" },
          ],
        },
      },
      {
        thought: "I'll fill in the destination field with London.",
        action: "type",
        element: "f2",
        text: "London",
        status: "pending",
      },
      {
        thought: "Setting the departure date to tomorrow.",
        action: "type",
        element: "f3",
        text: "Tomorrow",
        status: "pending",
      },
      {
        thought: "Submitting the flight search.",
        action: "click",
        element: "f4",
        status: "pending",
        pageState: {
          url: "https://www.google.com/flights?q=flights+to+london",
          title: "Flights to London",
          elements: [
            { id: "f5", role: "checkbox", name: "Stops: Nonstop only", highlighted: true },
            { id: "f6", role: "combobox", name: "Sort by" },
            { id: "f7", role: "link", name: "British Airways - $489" },
            { id: "f8", role: "link", name: "Delta - $520" },
          ],
        },
      },
      {
        thought: "I need to filter for direct/nonstop flights only.",
        action: "click",
        element: "f5",
        status: "pending",
      },
      {
        thought: "Extracting the cheapest direct flight options.",
        action: "extract",
        status: "pending",
        result: "Direct flights filtered. Reading results...",
        pageState: {
          url: "https://www.google.com/flights?q=flights+to+london&stops=nonstop",
          title: "Nonstop Flights to London",
          elements: [
            { id: "f9", role: "link", name: "British Airways — $489 (7h 10m)", highlighted: true },
            { id: "f10", role: "link", name: "Virgin Atlantic — $510 (7h 25m)", highlighted: true },
            { id: "f11", role: "link", name: "Delta — $545 (7h 40m)", highlighted: true },
          ],
        },
      },
    ],
    finalResult:
      "Here are the cheapest direct flights to London tomorrow:\n\n1. **British Airways** — $489 | Departs 6:30 PM | 7h 10m\n2. **Virgin Atlantic** — $510 | Departs 9:15 PM | 7h 25m\n3. **Delta** — $545 | Departs 5:00 PM | 7h 40m\n\nBritish Airways offers the lowest fare for a nonstop flight.",
  },
  {
    command: "Check the current weather in Tokyo",
    goalPlan: {
      goal: "check_weather",
      parameters: {
        location: "Tokyo",
        constraints: ["current conditions"],
      },
    },
    steps: [
      {
        thought: "I'll search Google for Tokyo's current weather.",
        action: "navigate",
        text: "https://www.google.com",
        status: "pending",
        pageState: {
          url: "https://www.google.com",
          title: "Google",
          elements: [
            { id: "w1", role: "textbox", name: "Search", highlighted: true },
            { id: "w2", role: "button", name: "Google Search" },
          ],
        },
      },
      {
        thought: "Typing the weather query into the search box.",
        action: "type",
        element: "w1",
        text: "weather in Tokyo",
        status: "pending",
      },
      {
        thought: "Submitting the search.",
        action: "click",
        element: "w2",
        status: "pending",
        pageState: {
          url: "https://www.google.com/search?q=weather+in+tokyo",
          title: "weather in tokyo - Google Search",
          elements: [
            { id: "w3", role: "region", name: "Weather widget", highlighted: true },
            { id: "w4", role: "text", name: "Temperature: 18°C" },
            { id: "w5", role: "text", name: "Condition: Partly Cloudy" },
            { id: "w6", role: "text", name: "Humidity: 65%" },
          ],
        },
      },
      {
        thought: "Weather widget detected. Extracting current conditions.",
        action: "extract",
        status: "pending",
        result: "Weather data extracted successfully.",
      },
    ],
    finalResult:
      "Current weather in **Tokyo, Japan**:\n\n🌤️ **Partly Cloudy** — 18°C (64°F)\n💧 Humidity: 65%\n💨 Wind: 12 km/h NW\n🌅 Sunset: 5:42 PM JST\n\nMild conditions with light winds. No rain expected today.",
  },
];

// Find a matching scenario or return a generic one
export function findScenario(command: string): Scenario {
  const lower = command.toLowerCase();
  
  if (lower.includes("amazon") || lower.includes("mouse") || lower.includes("product")) {
    return DEMO_SCENARIOS[0];
  }
  if (lower.includes("flight") || lower.includes("london") || lower.includes("travel")) {
    return DEMO_SCENARIOS[1];
  }
  if (lower.includes("weather") || lower.includes("tokyo") || lower.includes("temperature")) {
    return DEMO_SCENARIOS[2];
  }

  // Default: adapt the Amazon scenario with the user's command
  return {
    ...DEMO_SCENARIOS[0],
    command,
    goalPlan: {
      goal: "web_search",
      parameters: { query: command, constraints: ["best results"] },
    },
    finalResult: `I completed the search for "${command}". In a full implementation, I would have navigated real websites, extracted data, and presented the results here. This demo shows the agent's reasoning flow.`,
  };
}
