import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FormSidebar from "../components/FormSidebar";
import ProgressBar from "../components/ProgressBar";
import StepForm from "../components/StepForm";
import { motion } from "framer-motion";

export default function Profile() {
  const [step, setStep] = useState(0);
  const totalSteps = 6;

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <>
      <Header />
      <div className="min-h-[90vh] mt-12 py-10 px-2 md:px-8 relative flex justify-center items-center font-sans overflow-x-hidden bg-gradient-to-br from-blue-200 via-white to-purple-200">
        {/* Decorative blurred shapes for extra vibrance */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 rounded-full opacity-30 blur-2xl -z-10" style={{top: '-4rem', left: '-4rem'}} />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full opacity-20 blur-2xl -z-10" style={{bottom: '-6rem', right: '-6rem'}} />
        <div className="absolute top-1/2 left-1/2 w-1/2 h-32 bg-pink-100 rounded-full opacity-10 blur-3xl -z-10" style={{transform: 'translate(-50%, -50%)'}} />
        <motion.div
          className="flex flex-col md:flex-row gap-8 w-full max-w-6xl rounded-2xl shadow-2xl bg-white/90 p-4 md:p-8 border border-blue-200 items-start"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <motion.aside
            className="md:w-1/3 w-full mb-4 md:mb-0"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          >
            <FormSidebar step={step} />
          </motion.aside>
          <motion.main
            className="md:w-2/3 w-full flex flex-col gap-6"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          >
            <ProgressBar step={step} totalSteps={totalSteps} />
            <motion.div
              className="bg-white rounded-xl shadow-lg p-4 md:p-8 border border-blue-100 transition-all"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            >
              <StepForm
                step={step}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            </motion.div>
          </motion.main>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
