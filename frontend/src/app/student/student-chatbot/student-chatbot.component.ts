
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-student-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-chatbot.component.html',
  styleUrls: ['./student-chatbot.component.css']
})
export class StudentChatbotComponent implements OnInit {
  messages: ChatMessage[] = [];
  newMessage: string = '';
  isLoading: boolean = false;
  error: string | null = null;
  private genAI: GoogleGenerativeAI;
  private chat: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI('AIzaSyBbl0236vZiE5QAylom3gkKhOW_7sU0IBI');
  }

  ngOnInit() {
    this.initializeChat();
    this.messages.push({
      role: 'model',
      content: 'Hello! I\'m your UST learning assistant. How can I help you today?',
      timestamp: new Date()
    });
  }

  private async initializeChat() {
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-pro',
      generationConfig: {
        temperature: 0.9,
        topK: 32,
        topP: 1,
        maxOutputTokens: 2048,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
      ],
    });

    this.chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{
            text: "You are a helpful learning assistant for UST Global training program students. Be concise and friendly in your responses."
          }]
        },
        {
          role: "model",
          parts: [{
            text: "I understand. I'll act as a helpful learning assistant for UST Global training program students, providing concise and friendly responses."
          }]
        }
      ],
      generationConfig: {
        maxOutputTokens: 2048,
      },
    });
  }

  async sendMessage() {
    if (!this.newMessage.trim()) return;

    try {
      this.isLoading = true;
      this.error = null;

      
      this.messages.push({
        role: 'user',
        content: this.newMessage,
        timestamp: new Date()
      });

      
      const result = await this.chat.sendMessage(this.newMessage);
      const response = await result.response;
      
      
      this.messages.push({
        role: 'model',
        content: response.text(),
        timestamp: new Date()
      });

      
      this.newMessage = '';
      
    } catch (error: any) {
      this.error = 'Failed to get response from chatbot. Please try again.';
      console.error('Chatbot error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}