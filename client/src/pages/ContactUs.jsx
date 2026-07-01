import React from "react";
import toast from "react-hot-toast";

const ContactUs = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent successfully! We'll get back to you soon.", {
      icon: '✉️'
    });
    e.target.reset();
  };

  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-neutral-900 mb-4 text-center uppercase">Contact Us</h1>
        <p className="text-neutral-500 text-center mb-12 max-w-2xl mx-auto">
          We'd love to hear from you. Whether it's a question about an order, feedback on our sneakers, or just to say hello!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 mt-12 bg-neutral-50 p-6 sm:p-10 rounded-[24px] border border-neutral-200/60 shadow-sm">
          {/* Contact Information */}
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-8 text-neutral-900 tracking-tight">Get In Touch</h2>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white border border-neutral-200 flex items-center justify-center shrink-0 shadow-sm">
                  <span className="text-xl">📧</span>
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 text-sm uppercase tracking-wider mb-1">Email</h3>
                  <a href="mailto:hello@sprintwear.com" className="text-neutral-600 hover:text-neutral-900 transition-colors">hello@sprintwear.com</a>
                  <p className="text-sm text-neutral-400 mt-1">Our friendly team is here to help.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white border border-neutral-200 flex items-center justify-center shrink-0 shadow-sm">
                  <span className="text-xl">📱</span>
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 text-sm uppercase tracking-wider mb-1">Phone</h3>
                  <a href="tel:+919700000003" className="text-neutral-600 hover:text-neutral-900 transition-colors">+91 97*******3</a>
                  <p className="text-sm text-neutral-400 mt-1">Mon-Fri from 9am to 6pm IST.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white border border-neutral-200 flex items-center justify-center shrink-0 shadow-sm">
                  <span className="text-xl">📍</span>
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 text-sm uppercase tracking-wider mb-1">Office</h3>
                  <p className="text-neutral-600">SprintShoes HQ<br />123 Sneaker Avenue<br />New Delhi, India</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-white p-6 sm:p-8 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100">
            <h2 className="text-xl font-bold mb-6 text-neutral-900 tracking-tight">Send a Message</h2>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Name</label>
                <input required type="text" className="w-full px-4 py-3.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Email</label>
                <input required type="email" className="w-full px-4 py-3.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Message</label>
                <textarea required rows="4" className="w-full px-4 py-3.5 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all resize-none" placeholder="How can we help you today?"></textarea>
              </div>
              <button type="submit" className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:shadow-lg active:scale-[0.98]">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
