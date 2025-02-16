// openai.ts

export const getConsultationResponse = async (prompt: string) => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "deepseek/deepseek-r1-distill-llama-70b:free",
        "messages": [
          { "role": "user", "content": prompt }
        ],
        "top_p": 1,
        "temperature": 0.7,
        "repetition_penalty": 1
      })
    });

    const data = await response.json();

    if (response.ok) {
      return data.choices[0].message?.content || 'No response';
    } else {
      console.error('Error:', data);
      return 'An error occurred while fetching the response.';
    }
  } catch (error) {
    console.error('Error fetching consultation response:', error);
    return 'An error occurred while fetching the response.';
  }
};
