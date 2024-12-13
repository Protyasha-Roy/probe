import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(apiKey)

const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-exp',
  generationConfig: {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 8192,
  }
})

interface RoadmapInput {
  title: string
  skill_level: 'beginner' | 'intermediate' | 'advanced'
  time_commitment_hours: number
  learning_style: string[]
}

export interface RoadmapContent {
  sections: Array<{
    title: string
    description: string
    topics: Array<{
      title: string
      description: string
      resources: Array<{
        title: string
        url: string
        type: 'book' | 'article' | 'video' | 'interactive'
        description: string
      }>
    }>
  }>
}

export async function generateRoadmap(input: RoadmapInput): Promise<RoadmapContent> {
  const prompt = `Create a comprehensive learning roadmap for: ${input.title}
    
    Context:
    - Skill Level: ${input.skill_level}
    - Time Commitment: ${input.time_commitment_hours} hours per week
    - Learning Styles: ${input.learning_style.join(', ')}

    Create a detailed roadmap and return it in the following JSON format:

    {
      "sections": [
        {
          "title": "Section title",
          "description": "Section description",
          "topics": [
            {
              "title": "Topic title",
              "description": "Topic description",
              "resources": [
                {
                  "title": "Resource title",
                  "url": "Resource URL",
                  "type": "book|article|video|interactive",
                  "description": "Resource description"
                }
              ]
            }
          ]
        }
      ]
    }

    Requirements:
    1. Create as many sections as needed to comprehensively cover the topic
    2. Each section should have all necessary topics to master that section
    3. Each topic should have all relevant high-quality resources
    4. Resource types must be one of: book, article, video, interactive
    5. URLs should be fictional but realistic (e.g., coursera.org/learn/topic)
    6. Content should match ${input.skill_level} level
    7. Structure should support ${input.time_commitment_hours} hours/week
    8. Prefer resources matching these learning styles: ${input.learning_style.join(', ')}

    Return only valid JSON that matches the format above.`

  try {
    const result = await model.generateContent(prompt)
    const response = result.response.text()
    
    try {
      // Clean the response by removing markdown code blocks if present
      const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim()
      
      // Parse JSON response
      const content = JSON.parse(cleanedResponse) as RoadmapContent

      // Basic validation
      if (!content.sections || !Array.isArray(content.sections) || content.sections.length === 0) {
        console.error('Invalid or empty sections array:', response)
        throw new Error('No sections generated')
      }

      // Validate structure
      content.sections.forEach((section, sIndex) => {
        if (!section.title || !section.description || !Array.isArray(section.topics)) {
          throw new Error(`Invalid section structure at index ${sIndex}`)
        }

        section.topics.forEach((topic, tIndex) => {
          if (!topic.title || !topic.description || !Array.isArray(topic.resources)) {
            throw new Error(`Invalid topic structure at section ${sIndex}, topic ${tIndex}`)
          }

          if (topic.resources.length === 0) {
            throw new Error(`No resources for topic at section ${sIndex}, topic ${tIndex}`)
          }

          topic.resources.forEach(resource => {
            if (!['book', 'article', 'video', 'interactive'].includes(resource.type)) {
              resource.type = 'article' // Default to article if invalid type
            }
          })
        })
      })

      return content
    } catch (error) {
      console.error('Raw response:', response)
      console.error('Error parsing response:', error)
      throw new Error('Failed to generate valid roadmap structure')
    }
  } catch (error) {
    console.error('Error generating roadmap:', error)
    throw new Error('Failed to generate roadmap. Please try again.')
  }
}