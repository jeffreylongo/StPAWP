import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="bg-primary-blue-dark text-white py-16">
      <div class="container mx-auto px-4">
        <nav class="flex items-center gap-2 text-sm mb-4">
          <a routerLink="/" class="hover:text-primary-gold transition-colors">Home</a>
          <i class="fas fa-chevron-right"></i>
          <span class="text-primary-gold">Terms &amp; Conditions</span>
        </nav>
        <h1 class="font-cinzel text-4xl md:text-5xl font-bold">Terms &amp; Conditions</h1>
        <p class="mt-3 text-primary-gold-light">St. Petersburg Lodge No. 139, Free &amp; Accepted Masons</p>
      </div>
    </section>

    <section class="py-12 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto bg-neutral-light border border-gray-200 rounded-lg p-8 shadow-sm space-y-6 text-gray-700 leading-relaxed">
          <p><strong class="text-primary-blue">Effective / Last Updated:</strong> August 6, 2026</p>
          <p>
            These Terms &amp; Conditions (“Terms”) govern your use of the St. Petersburg Lodge No. 139
            website and related communications, including our text messaging program. By using our
            website or opting in to receive messages, you agree to these Terms.
          </p>

          <div>
            <h2 class="font-cinzel text-2xl text-primary-blue font-bold mb-3">Website Use</h2>
            <p>
              You agree to use this website for lawful purposes and in a manner that does not infringe
              the rights of, restrict, or inhibit anyone else from using the site. Content is provided
              for general informational purposes. For official lodge business, meeting details, or
              membership inquiries, please contact St. Petersburg Lodge No. 139 directly.
            </p>
          </div>

          <div>
            <h2 class="font-cinzel text-2xl text-primary-blue font-bold mb-3">Text Messaging Program</h2>
            <p>
              St. Petersburg Lodge No. 139 operates a voluntary text messaging program to send
              lodge-related communications to individuals who have opted in. Messages may include
              meeting reminders, event notices, membership updates, and other lodge-related information.
            </p>
          </div>

          <div>
            <h2 class="font-cinzel text-2xl text-primary-blue font-bold mb-3">Opt-In Method</h2>
            <p class="mb-3">You may join the text messaging program by one or more of the following methods:</p>
            <ul class="list-disc pl-6 space-y-2 mb-3">
              <li>Submitting your mobile number through a website form or online sign-up and consenting to receive SMS messages</li>
              <li>Providing verbal opt-in to a lodge officer or authorized representative</li>
              <li>Signing up in person at a lodge meeting or event</li>
              <li>Texting <strong>stpete139</strong> to <strong>727-634-7127</strong></li>
            </ul>
            <p>
              By opting in, you confirm that you are the owner or customary user of the mobile number
              provided and that you consent to receive automated and/or recurring text messages from
              St. Petersburg Lodge No. 139.
            </p>
          </div>

          <div>
            <h2 class="font-cinzel text-2xl text-primary-blue font-bold mb-3">Message Frequency</h2>
            <p>
              Message frequency varies. The number of messages you receive depends on lodge activity,
              meetings, and events.
            </p>
          </div>

          <div>
            <h2 class="font-cinzel text-2xl text-primary-blue font-bold mb-3">Message and Data Rates</h2>
            <p>
              <strong>Message and data rates may apply.</strong> Check your mobile carrier’s plan for
              details about text messaging charges.
            </p>
          </div>

          <div>
            <h2 class="font-cinzel text-2xl text-primary-blue font-bold mb-3">HELP Instructions</h2>
            <p>
              For help, text <strong>HELP</strong> to the number from which you receive messages, or
              contact us at
              <a href="mailto:secretary@stpete139.org" class="text-primary-blue underline hover:text-primary-gold">secretary&#64;stpete139.org</a>
              or
              <a href="tel:7274183356" class="text-primary-blue underline hover:text-primary-gold">(727) 418-3356</a>.
            </p>
          </div>

          <div>
            <h2 class="font-cinzel text-2xl text-primary-blue font-bold mb-3">STOP / Opt-Out Instructions</h2>
            <p class="mb-4">
              You may opt out at any time by texting <strong>STOP</strong> to the number from which
              you receive messages. After you send STOP, you will receive a confirmation message and
              <strong>no further messages will be sent</strong> unless you opt in again.
            </p>
            <div class="bg-white border-l-4 border-primary-gold p-4 shadow-sm">
              <p>
                Texting STOP cancels SMS communications from this program. It does not cancel other
                lodge memberships, email subscriptions, or unrelated communications unless separately requested.
              </p>
            </div>
          </div>

          <div>
            <h2 class="font-cinzel text-2xl text-primary-blue font-bold mb-3">Supported Carriers</h2>
            <p>
              The text messaging program is available on major U.S. carriers. Delivery is subject to
              effective transmission by your carrier.
              <strong>Carriers are not liable for delayed or undelivered messages.</strong>
            </p>
          </div>

          <div>
            <h2 class="font-cinzel text-2xl text-primary-blue font-bold mb-3">Privacy</h2>
            <p>
              Your use of the website and text messaging program is also governed by our
              <a routerLink="/privacy" class="text-primary-blue underline hover:text-primary-gold">Privacy Policy</a>,
              which explains how we collect, use, and protect personal information, including SMS opt-in data.
            </p>
          </div>

          <div>
            <h2 class="font-cinzel text-2xl text-primary-blue font-bold mb-3">Disclaimer</h2>
            <p>
              Website content is provided “as is” without warranties of any kind. We are not responsible
              for temporary outages, carrier delays, or undelivered messages outside our reasonable control.
            </p>
          </div>

          <div>
            <h2 class="font-cinzel text-2xl text-primary-blue font-bold mb-3">Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. The “Effective / Last Updated” date at the
              top of this page will reflect the latest revision. Continued use of the website or
              continued participation in the text messaging program after changes are posted constitutes
              acceptance of the updated Terms.
            </p>
          </div>

          <div>
            <h2 class="font-cinzel text-2xl text-primary-blue font-bold mb-3">Contact / Support</h2>
            <p class="mb-2">For support regarding the website or text messaging program, contact:</p>
            <p>
              <strong class="text-primary-blue">St. Petersburg Lodge No. 139</strong><br>
              Temporarily located at: 3325 1st St. NE, St. Petersburg, FL 33704<br>
              Phone: <a href="tel:7274183356" class="text-primary-blue underline hover:text-primary-gold">(727) 418-3356</a><br>
              Email: <a href="mailto:secretary@stpete139.org" class="text-primary-blue underline hover:text-primary-gold">secretary&#64;stpete139.org</a>
            </p>
          </div>

          <p class="text-sm text-gray-500 pt-4 border-t border-gray-200">
            Related:
            <a routerLink="/privacy" class="text-primary-blue underline hover:text-primary-gold">Privacy Policy</a>
            ·
            <a href="/assets/terms-of-service.html" class="text-primary-blue underline hover:text-primary-gold">Stable URL version</a>
          </p>
        </div>
      </div>
    </section>
  `
})
export class TermsComponent {}
