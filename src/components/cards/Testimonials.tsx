import { motion } from "framer-motion";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "CTO",
    company: "TechFlow Inc.",
    content: "This CDN platform has transformed how we deliver content. The performance improvements are remarkable, and the analytics provide invaluable insights.",
    image: "/testimonials/sarah.jpg"
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "Lead Developer",
    company: "DevScale",
    content: "The ease of integration and robust feature set make this platform stand out. Our load times decreased by 40% after implementation.",
    image: "/testimonials/marcus.jpg"
  },
  {
    id: 3,
    name: "Emma Thompson",
    role: "Engineering Manager",
    company: "CloudNine Solutions",
    content: "Outstanding support team and cutting-edge technology. This is exactly what we needed for our global content delivery needs.",
    image: "/testimonials/emma.jpg"
  }
];

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="relative p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 overflow-hidden group"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative z-10">
      <div className="flex items-center gap-4 mb-6">
        <motion.img
          whileHover={{ scale: 1.1 }}
          src={testimonial.image}
          alt={testimonial.name}
          className="w-16 h-16 rounded-full border-2 border-white/20 object-cover"
        />
        <div>
          <h3 className="text-xl font-bold text-white">{testimonial.name}</h3>
          <p className="text-gray-400">
            {testimonial.role} at {testimonial.company}
          </p>
        </div>
      </div>
      <blockquote className="text-gray-300 leading-relaxed">
        "{testimonial.content}"
      </blockquote>
    </div>
    <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
  </motion.div>
);

const Testimonials: React.FC = () => {
  return (
    <section className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="container mx-auto px-6"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            What Our Clients Say
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Don't just take our word for it. Here's what industry leaders have to say about our CDN platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Testimonials;
