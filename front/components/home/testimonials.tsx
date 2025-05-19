const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'iPhone User',
    content: 'The phone case is fantastic - stylish, durable, and perfectly fitted. I\'ve dropped my phone multiple times with no damage. Shipping was fast too!',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Tech Enthusiast',
    content: 'The wireless charger I purchased works flawlessly with all my devices. It charges quickly and the design is sleek. Excellent value for money!',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 3,
    name: 'Jessica Williams',
    role: 'Business Professional',
    content: 'These bluetooth earbuds exceeded my expectations. The sound quality is amazing, they\'re comfortable for all-day wear, and the battery life is impressive.',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

export default function Testimonials() {
  return (
    <section className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Don't just take our word for it - hear from some of our satisfied customers
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div 
            key={testimonial.id}
            className="border rounded-lg p-6 bg-card shadow-sm"
          >
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold">{testimonial.name}</h3>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
            <p className="italic text-muted-foreground">"{testimonial.content}"</p>
            <div className="mt-4 flex text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}