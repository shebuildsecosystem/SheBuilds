import React from 'react';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="bg-white">
      <main className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-4 font-martian">Privacy Policy</h1>
            <p className="text-xl text-gray-600 font-inter">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose lg:prose-xl mx-auto text-gray-600 font-inter">
            <p>
              SheBuilds ("us", "we", or "our") operates the www.shebuilds.tech website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
            </p>

            <h2>Information Collection and Use</h2>
            <p>
              We collect several different types of information for various purposes to provide and improve our Service to you. This may include, but is not limited to, your email address, name, and usage data.
            </p>

            <h2>Log Data</h2>
            <p>
              We may also collect information that your browser sends whenever you visit our Service or when you access the Service by or through a mobile device ("Log Data").
            </p>

            <h2>Cookies</h2>
            <p>
              Cookies are files with a small amount of data which may include an anonymous unique identifier. We use cookies and similar tracking technologies to track the activity on our Service and we hold certain information.
            </p>

            <h2>Use of Data</h2>
            <p>SheBuilds uses the collected data for various purposes:</p>
            <ul>
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so that we can improve our Service</li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>

            <h2>Security of Data</h2>
            <p>
              The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>

            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update the "last updated" date at the top of this Privacy Policy.
            </p>

            <h2>Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
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

export default PrivacyPolicy; 