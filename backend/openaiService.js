const OpenAI = require("openai");

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure the API key is loaded from .env
});

async function generateItinerary(
  destination,
  startDate,
  endDate,
  travelerType,
  budget,
  activities
) {
  const messages = [
    {
      role: "system",
      content: "You are a travel expert helping people plan trips.",
    },
    {
      role: "user",
      content: `
        Please create a personalized travel itinerary for a trip to ${destination}.
        The trip starts on ${startDate} and ends on ${endDate}.
        The traveler type is ${travelerType} with a budget of ${budget}.
        The preferred activities are: ${activities.join(", ")}.
        
        Please create a day-wise itinerary including attractions, restaurants, activities, and transportation tips, suitable for the traveler type and budget.
      `,
    },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4", // Or "gpt-3.5-turbo" if you prefer
      messages: messages,
      max_tokens: 1500,
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error generating itinerary:", error);
    return "Sorry, I couldn't generate an itinerary. Please try again.";
  }
}

module.exports = { generateItinerary };
