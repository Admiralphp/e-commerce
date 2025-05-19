export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">About PhoneGear</h1>
        
        <section className="prose dark:prose-invert">
          <p className="text-lg mb-6">
            Welcome to PhoneGear, your premier destination for high-quality smartphones and accessories. 
            Founded with a passion for mobile technology, we strive to provide our customers with the 
            latest and greatest in mobile devices and accessories.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p className="mb-6">
            Our mission is to make premium mobile technology accessible to everyone. We carefully curate 
            our selection of products to ensure that we offer only the highest quality items at competitive prices.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">What Sets Us Apart</h2>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">Expert product curation</li>
            <li className="mb-2">Competitive pricing</li>
            <li className="mb-2">Outstanding customer service</li>
            <li className="mb-2">Fast and reliable shipping</li>
            <li className="mb-2">Secure payment processing</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Customer Satisfaction</h2>
          <p className="mb-6">
            At PhoneGear, customer satisfaction is our top priority. Our dedicated support team is always 
            ready to assist you with any questions or concerns you may have about our products or services.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p className="mb-6">
            Have questions? We&apos;d love to hear from you! Contact our support team at 
            support@phonegear.com or visit our contact page for more ways to reach us.
          </p>
        </section>
      </div>
    </div>
  );
}
