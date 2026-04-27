import { motion } from "framer-motion";

export default function BackgroundOrbs({ bgImage }) {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Solid dark navy base matching barel-group */}
      <div className="absolute inset-0" style={{ background: "#0D1B4B" }} />

      {/* Background image with overlay */}
      <div
        className="absolute inset-0 opacity-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, #0D1B4Bcc, #0D1B4B90, #0D1B4Bcc)" }} />

      {/* Animated teal orbs matching barel brand */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ background: "#00C2C7" }}
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full blur-3xl opacity-8"
        style={{ background: "#00C2C7" }}
        animate={{
          x: [0, -40, 30, 0],
          y: [0, 30, -50, 0],
          scale: [1, 0.9, 1.15, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}