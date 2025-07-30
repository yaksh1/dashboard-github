import { Client, Account, Functions } from 'appwrite' // Import Functions


export const client = new Client()

client
  .setEndpoint('https://fra.cloud.appwrite.io/v1') // Your Appwrite Endpoint
  .setProject('688a065900139079de83') // Your project ID from Appwrite settings

export const account = new Account(client)
export const functions = new Functions(client) // Create and export the functions service
export { ID } from 'appwrite'
