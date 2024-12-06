import { motion } from "framer-motion";

const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    className="p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl"
  >
    <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
      <Icon className="text-2xl text-primary" />
    </div>
    <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </motion.div>
);

export default FeatureCard;
