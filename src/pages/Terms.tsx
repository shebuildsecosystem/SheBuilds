import React from 'react';
import Footer from '@/components/Footer';

const TermsOfService = () => {
  return (
    <div className="bg-white">
      <main className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-4 font-martian">Terms of Service</h1>
            <p className="text-xl text-gray-600 font-inter">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose lg:prose-xl mx-auto text-gray-600 font-inter">
            <h2>1. Terms</h2>
            <p>
              By accessing the website at www.shebuildsecosystem.com, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>

            <h2>2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or software) on SheBuilds' website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul>
              <li>modify or copy the materials;</li>
              <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
              <li>attempt to decompile or reverse engineer any software contained on SheBuilds' website;</li>
              <li>remove any copyright or other proprietary notations from the materials; or</li>
              <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
            </ul>

            <h2>3. Disclaimer</h2>
            <p>
              The materials on SheBuilds' website are provided on an 'as is' basis. SheBuilds makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>

            <h2>4. Limitations</h2>
            <p>
              In no event shall SheBuilds or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on SheBuilds' website, even if SheBuilds or a SheBuilds authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>

            <h2>5. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
            </p>

            <h2>Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us:</p>
            <ul>
              <li>By email: shebuilds.hacks@gmail.com</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService; 