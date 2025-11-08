import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { GradientHeading } from "@/components/BookDisplay";

export default function About() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="container py-6 pb-28 sm:pb-24">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3">
              Explore Books
            </Button>
          </Link>
          <Link href="/themes">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-3">
              Explore Themes
            </Button>
          </Link>
          <Link href="/series">
            <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold px-6 py-3">
              View Series
            </Button>
          </Link>
          <Link href="/audiobooks">
            <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold px-6 py-3">
              Listen to Audiobooks
            </Button>
          </Link>
        </div>
      </nav>

      {/* About Section */}
      <section className="container py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <GradientHeading as="h1" className="text-5xl md:text-6xl mb-8">
            About the Author
          </GradientHeading>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="md:col-span-1">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur-2xl opacity-20"></div>
                <img
                  src="/injectionshotmedoc.jpg"
                  alt="Dr. Brian Dale Babiak"
                  className="relative rounded-lg w-full object-cover border-2 border-slate-700 shadow-xl"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-6 text-slate-300 leading-relaxed">
              <p className="text-xl text-slate-200 font-semibold">
                Brian Dale Babiak, MD is a psychiatrist and neuropharmacologist with nearly four decades of medical experience.
              </p>

              <p>
                Educated in chemistry and quantum physics at Georgetown University, he earned his Doctor of Medicine from the Georgetown University School of Medicine in 1995.
              </p>

              <p>
                He first trained in diagnostic and interventional radiology in New Orleans, Louisiana, gaining early expertise in brain imaging and neuroanatomy before completing a psychiatry residency at LSU Health Sciences Center in Shreveport.
              </p>

              <p>
                Dr. Babiak's dual background in neuroimaging and psychiatry shaped his enduring focus on the biological underpinnings of mental illness—especially ADHD, PTSD, mood and anxiety disorders, and borderline personality disorder. He has practiced extensively in inpatient and outpatient settings, directed a children's psychiatric unit in upstate New York, and provided care for veterans on the U.S. Army Iraq–Afghanistan Polytrauma Team at Fort Drum. His work with the Houma Nation and with medically underserved communities in New Orleans deepened his commitment to accessible, evidence‑based mental health care.
              </p>

              <p>
                Today, Dr. Babiak maintains a private practice in Ithaca, New York, near Cornell University, specializing in complex diagnostic and neuropharmacologic cases involving ADHD, bipolar disorder, and trauma‑related conditions. His ongoing study of brain circuits, neurotransmission, and functional imaging continues to inform both his clinical work and his writing.
              </p>

              <p className="text-lg text-slate-200 font-semibold italic">
                Across genres, Dr. Babiak writes at the crossroads of neuroscience, psychiatry, and human behavior—translating complex systems into clear, practical insights and compelling stories.
              </p>
            </div>
          </div>

          {/* Credentials Card */}
          <Card className="bg-slate-800/50 border-slate-700 p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-6">Education & Experience</h2>
            <div className="grid md:grid-cols-2 gap-6 text-slate-300">
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Education</h3>
                <ul className="space-y-2">
                  <li>• MD, Georgetown University School of Medicine (1995)</li>
                  <li>• Chemistry & Quantum Physics, Georgetown University</li>
                  <li>• Radiology Training, New Orleans, Louisiana</li>
                  <li>• Psychiatry Residency, LSU Health Sciences Center, Shreveport</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Specializations</h3>
                <ul className="space-y-2">
                  <li>• ADHD & Neurodevelopmental Disorders</li>
                  <li>• PTSD & Trauma-Related Conditions</li>
                  <li>• Bipolar Disorder & Mood Disorders</li>
                  <li>• Borderline Personality Disorder</li>
                  <li>• Neuropharmacology & Brain Imaging</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* CTA */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-12">
            <Link href="/">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-6 text-lg">
                Explore Books
              </Button>
            </Link>
            <Link href="/themes">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-6 text-lg">
                Explore Themes
              </Button>
            </Link>
            <Link href="/series">
              <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold px-8 py-6 text-lg">
                View Series
              </Button>
            </Link>
            <Link href="/audiobooks">
              <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold px-8 py-6 text-lg">
                Listen to Audiobooks
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

