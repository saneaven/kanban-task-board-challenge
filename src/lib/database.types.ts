export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          status: string
          description: string | null
          priority: string
          due_date: string | null
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          title: string
          status?: string
          description?: string | null
          priority?: string
          due_date?: string | null
          position?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          status?: string
          description?: string | null
          priority?: string
          due_date?: string | null
          position?: number
          created_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          id: string
          user_id: string
          name: string
          color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          name: string
          color?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          color?: string | null
          created_at?: string
        }
        Relationships: []
      }
      task_assignees: {
        Row: {
          task_id: string
          member_id: string
          user_id: string
        }
        Insert: {
          task_id: string
          member_id: string
          user_id?: string
        }
        Update: {
          task_id?: string
          member_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'task_assignees_task_id_user_id_fkey'
            columns: ['task_id', 'user_id']
            isOneToOne: false
            referencedRelation: 'tasks'
            referencedColumns: ['id', 'user_id']
          },
          {
            foreignKeyName: 'task_assignees_member_id_user_id_fkey'
            columns: ['member_id', 'user_id']
            isOneToOne: false
            referencedRelation: 'team_members'
            referencedColumns: ['id', 'user_id']
          },
        ]
      }
      comments: {
        Row: {
          id: string
          task_id: string
          user_id: string
          body: string
          created_at: string
        }
        Insert: {
          id?: string
          task_id: string
          user_id?: string
          body: string
          created_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          user_id?: string
          body?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'comments_task_id_user_id_fkey'
            columns: ['task_id', 'user_id']
            isOneToOne: false
            referencedRelation: 'tasks'
            referencedColumns: ['id', 'user_id']
          },
        ]
      }
      labels: {
        Row: {
          id: string
          user_id: string
          name: string
          color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          name: string
          color?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          color?: string | null
          created_at?: string
        }
        Relationships: []
      }
      task_labels: {
        Row: {
          task_id: string
          label_id: string
          user_id: string
        }
        Insert: {
          task_id: string
          label_id: string
          user_id?: string
        }
        Update: {
          task_id?: string
          label_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'task_labels_task_id_user_id_fkey'
            columns: ['task_id', 'user_id']
            isOneToOne: false
            referencedRelation: 'tasks'
            referencedColumns: ['id', 'user_id']
          },
          {
            foreignKeyName: 'task_labels_label_id_user_id_fkey'
            columns: ['label_id', 'user_id']
            isOneToOne: false
            referencedRelation: 'labels'
            referencedColumns: ['id', 'user_id']
          },
        ]
      }
      task_activity: {
        Row: {
          id: string
          task_id: string
          user_id: string
          action: string
          details: Json
          created_at: string
        }
        Insert: {
          id?: string
          task_id: string
          user_id: string
          action: string
          details?: Json
          created_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          user_id?: string
          action?: string
          details?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'task_activity_task_id_user_id_fkey'
            columns: ['task_id', 'user_id']
            isOneToOne: false
            referencedRelation: 'tasks'
            referencedColumns: ['id', 'user_id']
          },
        ]
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
