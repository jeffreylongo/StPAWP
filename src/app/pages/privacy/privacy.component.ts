import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="bg-primary-blue-dark text-white py-16">
      <div class="container mx-auto px-4">
        <nav class="flex items-center gap-2 text-sm mb-4">
          <a routerLink="/" class="hover:text-primary-gold transition-colors">Home</a>
          <i class="fas fa-chevron-right"></i>
          <span class="text-primary-gold">Privacy Policy</span>
        </nav>
        <h1 class="font-cinzel text-4xl md:text-5xl font-bold">Privacy Policy</h1>
        <p class="mt-3 text-primary-gold-light">St. Petersburg Lodge No. 139, Free &amp; Accepted Masons</p>
      </div>
    </section>

    <section class="py-12 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto bg-neutral-light border border-gray-200 rounded-lg p-8 shadow-sm prose-legal space-y-6 text-gray-700 leading-relaxed">
          <p><strong class="text-primary-blue">Effective / Last Updated:</strong> August 6, 2026</p>
          <p>
            St. Petersburg Lodge No. 139 (“we,” “us,” or “our”) respects your privacy.
            This Privacy Policy explains what information we collect, how we use it,
            with whom it may be shared, and the choices you have.
          </p>

          <div>
            <h2 class="font-cinzel text-2xl text-primary-blue font-bold mb-3">Information We Collect</h2>
            <p class="mb-3">We may collect the following information:</p>
            <ul class="list-disc pl-6 space-y-2">
              <li><strong>Contact information:</strong> name, phone number, email address, and mailing address</li>
              <li><strong>Membership or inquiry details:</strong> information you provide related to lodge membership, petitions, or event attendance</li>
              <li><strong>Communications content:</strong> messages you send through website forms or email</li>
              <li><strong>Text messaging data:</strong> mobile phone number and opt-in/opt-out consent status for SMS communications</li>
              <li><strong>Technical data:</strong> limited website usage information such as browser type, device type, and pages visited (if collected by our hosting or analytics tools)</li>
            </ul>
          </div>

          <div>
            <h2 class="font-cinzel text-2xl text-primary-blue font-bold mb-3">How We Collect Information</h2>
            <p class="mb-3">We collect information through:</p>
            <ul class="list-disc pl-6 space-y-2">
              <li>Website forms (including contact and inquiry forms)</li>
              <li>In-person sign-up at lodge events or meetings</li>
              <li>Verbal opt-in provided to lodge officers or authorized representatives</li>
              <li>Email or phone communications with the lodge</li>
              <li>Text message keyword or reply opt-in, if offered</li>
            </ul>
          </div>

          <div>
            <h2 class="font-cinzel text-2xl text-primary-blue font-bold mb-3">How We Use Information</h2>
            <p class="mb-3">We use the information we collect to:</p>
            <ul class="list-disc pl-6 space-y-2">
              <li>Respond to inquiries and membership-related requests</li>
              <li>Provide lodge notices, meeting reminders, event updates, and other lodge-related communications</li>
              <li>Administer membership and lodge business</li>
              <li>Operate, maintain, and improve our website and services</li>
              <li>Comply with applicable laws and Masonic governance requirements</li>
            </ul>
          </div>

          <div>
            <h2 class="font-cinzel text-2xl text-primary-blue font-bold mb-3">Who We Share Information With</h2>
            <p class="mb-3">We do not sell your personal information. We may share information only as needed with:</p>
            <ul class="list-disc pl-6 space-y-2 mb-3">
              <li><strong>Service providers</strong> who help us operate our website, email, or text messaging program (for example, hosting providers and SMS platform providers)</li>
              <li><strong>Payment processors</strong>, if you make a payment through a lodge-related service</li>
              <li><strong>Grand Lodge or related Masonic bodies</strong>, when required for membership or official lodge business</li>
              <li><strong>Legal authorities</strong>, when required by law or to protect the rights, safety, and property of the lodge or others</li>
            </ul>
            <p>
              These parties are expected to use the information only to perform services on our behalf
              or as otherwise required by law.
            </p>
          </div>

          <div>
            <h2 class="font-cinzel text-2xl text-primary-blue font-bold mb-3">Text Messaging / SMS Communications</h2>
            <p class="mb-4">
              If you opt in to receive text messages from St. Petersburg Lodge No. 139, we will use your
              mobile number to send lodge-related SMS communications as described in our
              <a routerLink="/terms" class="text-primary-blue underline hover:text-primary-gold">Terms &amp; Conditions</a>.
            </p>
            <div class="bg-white border-l-4 border-primary-gold p-4 shadow-sm">
              <p class="text-gray-900 font-semibold">
                No mobile information will be shared with third parties/affiliates for marketing/promotional purposes.
                All the above categories exclude text messaging originator opt-in data and consent; this information
                will not be shared with any third parties.
              </p>
            </div>
          </div>

          <div>
            <h2 class="font-cinzel text-2xl text-primary-blue font-bold mb-3">Your Rights and Choices</h2>
            <p class="mb-3">Depending on applicable law, you may have the right to:</p>
            <ul class="list-disc pl-6 space-y-2 mb-3">
              <li><strong>Access</strong> the personal information we hold about you</li>
              <li><strong>Request correction</strong> of inaccurate information</li>
              <li><strong>Request deletion</strong> of your personal information, subject to legal or membership record-keeping requirements</li>
              <li><strong>Opt out</strong> of promotional or non-essential communications</li>
            </ul>
            <p>
              To opt out of SMS messages at any time, text <strong>STOP</strong> to the number from which
              you receive messages. For help, text <strong>HELP</strong>. You may also contact us using
              the information below to request access, correction, deletion, or opt-out assistance.
            </p>
          </div>

          <div>
            <h2 class="font-cinzel text-2xl text-primary-blue font-bold mb-3">Data Retention</h2>
            <p>
              We retain personal information only as long as needed for the purposes described in this
              Policy, including lodge administration, legal obligations, and dispute resolution, unless
              a longer retention period is required or permitted by law.
            </p>
          </div>

          <div>
            <h2 class="font-cinzel text-2xl text-primary-blue font-bold mb-3">Security</h2>
            <p>
              We take reasonable administrative, technical, and organizational measures to protect
              personal information. No method of transmission or storage is completely secure, and we
              cannot guarantee absolute security.
            </p>
          </div>

          <div>
            <h2 class="font-cinzel text-2xl text-primary-blue font-bold mb-3">Children’s Privacy</h2>
            <p>
              Our website and communications are intended for adults. We do not knowingly collect
              personal information from children under 13.
            </p>
          </div>

          <div>
            <h2 class="font-cinzel text-2xl text-primary-blue font-bold mb-3">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The “Effective / Last Updated” date
              at the top of this page will reflect the latest revision. Continued use of our website or
              services after changes are posted constitutes acceptance of the updated Policy.
            </p>
          </div>

          <div>
            <h2 class="font-cinzel text-2xl text-primary-blue font-bold mb-3">Contact Us</h2>
            <p class="mb-2">For privacy questions or requests, contact:</p>
            <p>
              <strong class="text-primary-blue">St. Petersburg Lodge No. 139</strong><br>
              Temporarily located at: 3325 1st St. NE, St. Petersburg, FL 33704<br>
              Phone: <a href="tel:7274183356" class="text-primary-blue underline hover:text-primary-gold">(727) 418-3356</a><br>
              Email: <a href="mailto:secretary@stpete139.org" class="text-primary-blue underline hover:text-primary-gold">secretary&#64;stpete139.org</a>
            </p>
          </div>

          <p class="text-sm text-gray-500 pt-4 border-t border-gray-200">
            Related:
            <a routerLink="/terms" class="text-primary-blue underline hover:text-primary-gold">Terms &amp; Conditions</a>
            ·
            <a href="/assets/privacy-policy.html" class="text-primary-blue underline hover:text-primary-gold">Stable URL version</a>
          </p>
        </div>
      </div>
    </section>
  `
})
export class PrivacyComponent {}
