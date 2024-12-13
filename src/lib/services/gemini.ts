import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(apiKey)

const model = genAI.getGenerativeModel({
  model: 'gemini-pro',
})

const generationConfig = {
  temperature: 0.7,
  topP: 0.8,
  topK: 40,
  maxOutputTokens: 8192,
}

interface RoadmapInput {
  title: string
  skill_level: 'beginner' | 'intermediate' | 'advanced'
  time_commitment_hours: number
  learning_style: string[]
}

export interface GeneratedSection {
  title: string
  description: string
  topics: {
    title: string
    description: string
    resources: {
      title: string
      url: string
      type: 'book' | 'article' | 'video' | 'interactive'
      description: string
    }[]
  }[]
}

export async function generateRoadmap(input: RoadmapInput): Promise<GeneratedSection[]> {
  const prompt = `Create a detailed learning roadmap for: ${input.title}
    
    Context:
    - Skill Level: ${input.skill_level}
    - Time Commitment: ${input.time_commitment_hours} hours per week
    - Learning Styles: ${input.learning_style.join(', ')}

    Format the response as a JSON array of sections with this structure:
    [
      {
        "title": "Section Title",
        "description": "Detailed section description",
        "topics": [
          {
            "title": "Topic Title",
            "description": "Detailed topic description",
            "resources": [
              {
                "title": "Resource Title",
                "url": "URL",
                "type": "video|article|book|interactive",
                "description": "Brief resource description"
              }
            ]
          }
        ]
      }
    ]

    Requirements:
    1. Generate 5-7 main sections
    2. Each section should have 3-5 topics
    3. Each topic should have 3-4 resources
    4. Resource types should match the user's learning styles when possible
    5. URLs should be realistic but fictional (e.g., example.com/course/xyz)
    6. Descriptions should be detailed and actionable
    7. Content should be appropriate for ${input.skill_level} level
    8. Structure should support ${input.time_commitment_hours} hours/week of learning
    9. All JSON properties must match the structure exactly`

  try {
    const result = await model.generateContent(prompt)
    const response = result.response.text()
    
    try {
      // Parse and validate the JSON response
      const content: GeneratedSection[] = JSON.parse(response)
      
      // Basic validation
      if (!Array.isArray(content)) {
        throw new Error('Response is not an array of sections')
      }

      // Validate each section
      content.forEach((section, sIndex) => {
        if (!section.title || !section.description || !Array.isArray(section.topics)) {
          throw new Error(`Invalid section structure at index ${sIndex}`)
        }

        section.topics.forEach((topic, tIndex) => {
          if (!topic.title || !topic.description || !Array.isArray(topic.resources)) {
            throw new Error(`Invalid topic structure at section ${sIndex}, topic ${tIndex}`)
          }

          topic.resources.forEach((resource, rIndex) => {
            if (!resource.title || !resource.url || !resource.type || !resource.description) {
              throw new Error(`Invalid resource structure at section ${sIndex}, topic ${tIndex}, resource ${rIndex}`)
            }

            if (!['book', 'article', 'video', 'interactive'].includes(resource.type)) {
              throw new Error(`Invalid resource type at section ${sIndex}, topic ${tIndex}, resource ${rIndex}`)
            }
          })
        })
      })

      return content
    } catch (error) {
      console.error('Error parsing AI response:', error)
      throw new Error('Failed to generate valid roadmap structure')
    }
  } catch (error) {
    console.error('Error generating roadmap:', error)
    throw new Error('Failed to generate roadmap. Please try again.')
  }
} 