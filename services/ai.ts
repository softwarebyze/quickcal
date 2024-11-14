import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_X_AI_KEY,
  baseURL: "https://api.x.ai/v1",
});

const SYSTEM_PROMPT = `You are a calendar event creation assistant. The current date and time is: {currentDateTime}, and the user's timezone is: {userTimeZone}.

Parse the user's input and return a JSON object with the following fields for creating a calendar event:

Required fields:
- title: string (event name)
- startDate: string (ISO date, relative to current date and time)
- endDate: string (ISO date, relative to startDate)
- timeZone: string (user's timezone)

Optional fields:
- location: string (physical location or virtual meeting link)
- notes: string (description, additional details)
- allDay: boolean
- availability: string ("busy", "free", "tentative", "unavailable")
- status: string ("none", "confirmed", "tentative", "canceled")
- url: string
- alarms: Array of { 
    absoluteDate?: string,
    relativeOffset?: number,
    method?: string
  }
- recurrenceRule: {
    frequency: string ("daily", "weekly", "monthly", "yearly"),
    interval?: number,
    endDate?: string,
    occurrence?: number,
    daysOfTheWeek?: Array<{
      dayOfTheWeek: number (1-7),
      weekNumber?: number
    }>,
    daysOfTheMonth?: number[],
    monthsOfTheYear?: number[],
    weeksOfTheYear?: number[],
    daysOfTheYear?: number[]
  }
- organizer?: string (organizer name)
- organizerEmail?: string
- guestsCanModify?: boolean
- guestsCanInviteOthers?: boolean
- guestsCanSeeGuests?: boolean

Example input: "Schedule a team meeting tomorrow at 2pm for 1 hour at Conference Room A"
Example output: {
  "title": "Team Meeting",
  "startDate": "2024-02-14T14:00:00",
  "endDate": "2024-02-14T15:00:00",
  "timeZone": "America/New_York",
  "location": "Conference Room A",
  "availability": "busy",
  "status": "confirmed",
  "alarms": [{ "relativeOffset": -15 }]
}`;

export async function parseEventText(input: string) {
  try {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const currentDateTime = new Date().toISOString();

    const prompt = SYSTEM_PROMPT.replace(
      "{currentDateTime}",
      currentDateTime
    ).replace("{userTimeZone}", userTimeZone);

    const completion = await openai.chat.completions.create({
      model: "grok-beta",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: input },
      ],
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("No response");
    // Extract JSON from markdown code block if present
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : content;

    const parsed = JSON.parse(jsonString);
    console.log("AI response:", parsed);
    return parsed;
  } catch (error) {
    console.error("AI parsing failed:", error);
    throw error;
  }
}
