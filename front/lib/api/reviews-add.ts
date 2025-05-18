// Function to add a new review
export async function addReview(productId: string, review: Omit<Review, 'id' | 'date'>): Promise<Review> {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const url = `${API_URL}/products/${productId}/reviews`;
    console.log('Adding review via API:', url);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(review)
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API returned new review:', data);
    return data;
  } catch (error) {
    console.error('Error adding review via API:', error);
    throw error;
  }
}
