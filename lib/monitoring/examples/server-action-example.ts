/**
 * Example of using API metrics in a Next.js Server Action
 */

'use server';

import { sendApiMetric } from '../api';

/**
 * Example server action that includes API metrics
 */
export async function exampleServerAction(formData: FormData) {
  const startTime = performance.now();
  
  try {
    // Extract data from form
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    
    // Validate inputs
    if (!name || !email) {
      // Send validation error metrics
      sendApiMetric({
        path: '/actions/example',
        method: 'POST',
        statusCode: 400,
        duration: performance.now() - startTime,
        source: 'server',
        error: 'Validation Error',
      });
      
      return { success: false, error: 'Missing required fields' };
    }
    
    // Process the action
    // ...your logic here...
    
    // Send success metrics
    sendApiMetric({
      path: '/actions/example',
      method: 'POST',
      statusCode: 200,
      duration: performance.now() - startTime,
      source: 'server',
      metadata: {
        // Include non-sensitive metadata
        formFields: ['name', 'email'],
      },
    });
    
    return { success: true };
  } catch (error) {
    // Send error metrics
    sendApiMetric({
      path: '/actions/example',
      method: 'POST',
      statusCode: 500,
      duration: performance.now() - startTime,
      source: 'server',
      error: error instanceof Error ? error.message : String(error),
    });
    
    return { 
      success: false, 
      error: 'An unexpected error occurred' 
    };
  }
}

/**
 * Helper function to wrap server actions with metrics
 */
export function withActionMetrics<T, P extends unknown[]>(
  actionPath: string,
  fn: (...args: P) => Promise<T>
): (...args: P) => Promise<T> {
  return async (...args: P) => {
    const startTime = performance.now();
    
    try {
      // Execute the action
      const result = await fn(...args);
      
      // Send success metrics
      sendApiMetric({
        path: actionPath,
        method: 'POST', // Server actions are typically POST
        statusCode: 200,
        duration: performance.now() - startTime,
        source: 'server',
      });
      
      return result;
    } catch (error) {
      // Send error metrics
      sendApiMetric({
        path: actionPath,
        method: 'POST',
        statusCode: 500,
        duration: performance.now() - startTime,
        source: 'server',
        error: error instanceof Error ? error.message : String(error),
      });
      
      // Re-throw the error
      throw error;
    }
  };
}

/**
 * Example usage of the helper function
 */
export const createUser = withActionMetrics(
  '/actions/createUser',
  async (userData: { name: string; email: string }) => {
    // Your user creation logic here
    console.log('Creating user:', userData);
    return { userId: '123', success: true };
  }
);

