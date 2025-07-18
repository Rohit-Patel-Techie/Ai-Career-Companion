import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import CtaSection from "../components/CtaSection";
import HowItWorks from "../components/HowItWorks";
import { motion } from "framer-motion";
import WhyChooseUs from "../components/WhyChooseUs";

export default function HomePage() {

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <CtaSection />
            <HowItWorks />
            <ProductCard />
            <WhyChooseUs />
            <Footer />
        </div>
    );
}