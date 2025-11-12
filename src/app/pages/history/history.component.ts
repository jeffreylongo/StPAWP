import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-primary-blue-dark text-white py-16">
      <div class="container mx-auto px-4">
        <nav class="flex items-center gap-2 text-sm mb-4">
          <a routerLink="/" class="hover:text-primary-gold transition-colors">Home</a>
          <i class="fas fa-chevron-right"></i>
          <span class="text-primary-gold">History</span>
        </nav>
        <h1 class="font-cinzel text-4xl md:text-5xl font-bold">Our History</h1>
        <p class="text-primary-gold-light text-xl mt-4">St. Petersburg Lodge No. 139 F. & A. M.</p>
      </div>
    </div>
    
    <div class="container mx-auto px-4 py-12">
      <!-- Introduction -->
      <div class="max-w-4xl mx-auto mb-16">
        <div class="text-center mb-12">
          <h2 class="font-cinzel text-3xl font-bold text-primary-blue mb-6">In The Beginning</h2>
          <div class="w-24 h-1 bg-primary-gold mx-auto mb-8"></div>
        </div>
        
        <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed">
          <p class="text-lg mb-6">
            In 1888, when the Orange Belt Railroad arrived, the population of the area was only around fifty people, spread across small, quiet villages like Wardsville, Williamsville, and Pinellas Village. Mr. J. C. Williams, Sr., often referred to as the "Father of St. Petersburg," persuaded Mr. Peter Demens to construct the first railroad station, a railroad pier, and The Detroit Hotel. In the absence of Mr. Demens, the Post Mistress, seeking guidance for naming the town, spoke to his associate in Sanford, Florida. The associate suggested naming it after Mr. Demens' birth city, and thus, St. Petersburg was chosen.
          </p>
          
          <p class="mb-6">
            By 1890, the town's population had grown to about 270 people, prompting the formation of two political parties, the Wets and the Drys, who conducted an incorporation election. This election led to the prohibition of livestock grazing on city lots and the enforcement of speed limits for horseback riding within the town.
          </p>
          
          <p class="mb-6">
            Pinellas County was initially part of Hillsborough County and gained separate status in May 1911. St. Petersburg officially became a city in 1903, boasting a population of approximately 600 people.
          </p>
          
          <div class="bg-primary-gold-light p-6 rounded-lg my-8">
            <p class="text-primary-blue-dark font-medium">
              <strong>In December 1893, St. Petersburg Lodge No. 139 F. & A.M. was established as a U.D. (Under Dispensation) Lodge. In January 1894, it was one of nine Lodges chartered under Brother Marcus Endel, Grand Master of the Grand Lodge of Florida.</strong>
            </p>
          </div>
          
          <p class="mb-6">
            The Charter Members, comprised of influential figures in the town, included Brother W. W. Coleman, a hotel owner and Worshipful Master; Brother H. W. Hibbs, owner of the first wholesale fish house and Senior Warden; Brother J. C. Williams, Jr., owner of Crystal Ice Company, a hardware store, and a land developer, serving as Junior Warden; Brother G. L. King, owner of the first sawmill, serving as Treasurer; and Brother James Henry as Secretary. Brothers J. C. Blocker, J.T. Blackman and Robert Johnson rounded out the nine Charter Members. Brothers J. C. Williams, Jr., and H. W. Hibbs later served on the City Council and Brother Hibbs later served two terms as Mayor.
          </p>
          
          <p class="mb-8">
            Though starting with nine members, St. Petersburg Lodge #139 F. & A.M. experienced significant growth, reaching a peak membership of 1,256 in 1956. Over the years, members from the lodge played pivotal roles in establishing other local lodges. The past 130 years have marked a captivating and dynamic journey for the lodge and the community it has been a part of.
          </p>
        </div>
      </div>

      <!-- Timeline Sections -->
      
      <!-- 1893-1909: The Founders -->
      <div class="mb-16">
        <div class="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
          <div class="bg-gradient-to-r from-primary-blue to-primary-blue-dark text-white p-6">
            <h3 class="font-cinzel text-2xl font-bold flex items-center">
              <i class="fas fa-users text-primary-gold mr-3"></i>
              1893-1909: The Founders
            </h3>
          </div>
          <div class="p-8">
            <div class="grid md:grid-cols-2 gap-8 items-start">
              <div>
                <div class="bg-neutral-light p-6 rounded-lg mb-6">
                  <div class="mb-6 flex justify-center">
                    <img src="assets/past-masters/walter-w-coleman.jpg" 
                         alt="W.W. Coleman - First Worshipful Master" 
                         class="w-48 h-auto rounded-lg shadow-md">
                  </div>
                  <h4 class="font-cinzel text-xl font-bold text-primary-blue mb-2">W.W. Coleman</h4>
                  <p class="text-primary-gold font-medium mb-2">1894-1895</p>
                  <p class="text-gray-700 mb-4">1st Worshipful Master of St.Petersburg Lodge 139 F&AM</p>
                  <blockquote class="italic text-gray-600 border-l-4 border-primary-gold pl-4">
                    "Let us raise a standard to which the wise and honest can repair; the rest is in the hands of God." – George Washington
                  </blockquote>
                </div>
              </div>
              
              <div>
                <h4 class="font-cinzel text-lg font-bold text-primary-blue mb-4">The Founding of St.Petersburg Lodge #139</h4>
                <p class="text-gray-700 mb-4">
                  St. Petersburg Lodge # 139 was organized and held its first meeting as an U.D. Lodge on December 1, 1893 with 9 charter members:
                </p>
                <ul class="space-y-2 text-gray-700 mb-6">
                  <li><strong>Walter W. Coleman</strong> – 1st W.M.</li>
                  <li><strong>Henry W. Hibbs</strong></li>
                  <li><strong>John Constantine Williams Jr.</strong></li>
                  <li><strong>George W. Kennedy</strong></li>
                  <li><strong>Robert Johnson</strong></li>
                  <li><strong>J.C. Blocker</strong></li>
                  <li><strong>James Henry</strong> – 1st Sec.</li>
                  <li><strong>George F. King</strong></li>
                  <li><strong>John F. Blackmon</strong></li>
                </ul>
                
                <p class="text-gray-700 mb-4">
                  They convened in the International Order of Odd Fellows (IOOF) Hall, believed to be located on Central Avenue just west of 4th Street, approximately where the Phiel Hotel stood. The monthly rent for the hall was $3.10.
                </p>
                
                <p class="text-gray-700">
                  The Lodge received its charter on January 17, 1894, under the leadership of Marcus Endel, G.M., who was actively involved in unifying Masonic work and illustration. During the period from 1893 to 1915, the Lodge changed locations several times, being hosted by organizations such as the Knights of Pythias (K of P), IOOF, Woodmen of the World (W.O.W.), and A.C. Phiel, the world's first airline passenger in 1914.
                </p>
              </div>
            </div>
            
            <div class="mt-8 bg-primary-gold-light p-6 rounded-lg">
              <h5 class="font-bold text-primary-blue mb-3">Committee Formed To Find Our Lodge A Permanent Home</h5>
              <p class="text-gray-700">
                The quest for a permanent home gained traction around September 1901, and by October 7, 1902, a committee was appointed to explore and develop this idea. By 1906, the rent had escalated to $85.00 per year, yet the Lodge persevered for another three years. On November 16, 1909, the building committee reported finding a suitable property at the Northeast corner of 4th Street and 2nd Avenue South. On November 23, 1909, the committee was directed to negotiate the best terms for purchasing this property. By January 4, 1910, the Building Committee was instructed to acquire the property, known as the V. N. Ridgley property, which remains the current location of the Lodge.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 1910-1919: A New Home -->
      <div class="mb-16">
        <div class="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
          <div class="bg-gradient-to-r from-primary-blue to-primary-blue-dark text-white p-6">
            <h3 class="font-cinzel text-2xl font-bold flex items-center">
              <i class="fas fa-home text-primary-gold mr-3"></i>
              1910-1919: A New Home for 139 & The Beginnings of the Masonic Home
            </h3>
          </div>
          <div class="p-8">
            <div class="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <div class="bg-neutral-light p-6 rounded-lg">
                  <h4 class="font-cinzel text-xl font-bold text-primary-blue mb-2">The First Lodge 139 Temple</h4>
                  <p class="text-primary-gold font-medium mb-2">1916</p>
                  <p class="text-gray-700 mb-4">Downtown St.Petersburg | 4th Street & 2nd Ave S.</p>
                  <blockquote class="italic text-gray-600 border-l-4 border-primary-gold pl-4">
                    "Be courteous to all, but intimate with few, and let those few be well tried before you give them your confidence."
                  </blockquote>
                </div>
              </div>
              
              <div>
                <h4 class="font-cinzel text-lg font-bold text-primary-blue mb-4">Breaking Ground Downtown</h4>
                <p class="text-gray-700 mb-4">
                  On October 25, 1912, the rent for the building used for meetings was increased to $125 per year. However, on December 3, 1912, the Lodge decided to put the 4th Street property up for sale with an asking price of $10,000, but there were no takers. By February 3, 1914, plans for a new temple had been drawn and examined, but no action was taken. On March 2, 1915, the Lodge authorized the Trustees to negotiate a loan on the 4th Street property for the construction of the new temple.
                </p>
              </div>
            </div>
            
            <div class="mb-8">
              <h4 class="font-cinzel text-lg font-bold text-primary-blue mb-4">Ground Breaks on the Lot For Our Own Masonic Temple</h4>
              <p class="text-gray-700 mb-4">
                Groundbreaking for the new Masonic Temple took place on November 4, 1915. The Lodge voted on October 19, 1915, to sell Life Memberships for $100, which later posed challenges in 1930. The groundbreaking ceremony occurred on the Northeast Corner of 4th Street and 2nd Avenue South, with W. M. W. W. Birchfield, the Worshipful Master of St. Petersburg Lodge #139, turning the first shovel of sand. The inaugural meeting in the new Temple was held on March 28, 1916.
              </p>
            </div>
            
            <div class="bg-primary-blue-light p-6 rounded-lg">
              <h4 class="font-cinzel text-lg font-bold text-primary-blue mb-4">The Beginnings of the Masonic Home & Orphanage</h4>
              <p class="text-gray-700 mb-4">
                In March 1914, St. Petersburg Lodge contributed $100.00 to the Masonic Home & Orphanage Fund. The concept of a Masonic Home & Orphanage had been introduced to the Grand Lodge by Bro. A.W. Gilcrest in 1902, who later became the Grand Master of Masons in Florida. On March 17, 1914, the West Coast Company offered to donate 100 acres of land for the Masonic Home & Orphanage, which was accepted by St. Petersburg Lodge.
              </p>
              
              <p class="text-gray-700">
                On July 3, 1917, correspondence from the Grand Master confirmed that the Committee on Selection of a site for the Masonic Home & Orphanage had chosen St. Petersburg. This decision was largely influenced by the persistent efforts of Bro. Ed. T. Lewis, Mr. A.P. Avery, Mr. Lew B. Brown, Walter P. Fuller, and H. Walter Fuller, representing St. Petersburg through St. Petersburg Lodge #139. In response, a motion was passed that each member of the Lodge be assessed $500.00 to assist the Grand Lodge Committee with the Masonic Home site.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 1920-1929: Nitram is Born -->
      <div class="mb-16">
        <div class="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
          <div class="bg-gradient-to-r from-primary-blue to-primary-blue-dark text-white p-6">
            <h3 class="font-cinzel text-2xl font-bold flex items-center">
              <i class="fas fa-star text-primary-gold mr-3"></i>
              1920-1929: Nitram is Born | Big Talk, Little Action
            </h3>
          </div>
          <div class="p-8">
            <div class="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <div class="bg-neutral-light p-6 rounded-lg">
                  <h4 class="font-cinzel text-xl font-bold text-primary-blue mb-2">Nitram Masonic Lodge</h4>
                  <p class="text-primary-gold font-medium mb-2">1925</p>
                  <p class="text-gray-700 mb-4">4275 78th Street N. | St.Petersburg, FL</p>
                  <blockquote class="italic text-gray-600 border-l-4 border-primary-gold pl-4">
                    "Opportunity is missed by most people because it is dressed in overalls and looks like work."
                  </blockquote>
                </div>
              </div>
              
              <div>
                <h4 class="font-cinzel text-lg font-bold text-primary-blue mb-4">A Lodge Temple For All Brothers of St.Petersburg?</h4>
                <p class="text-gray-700 mb-4">
                  In 1924, during the thriving period known as Boom Days, discussions emerged about a new Masonic Temple jointly owned by all Masonic bodies in St. Petersburg. Preliminary sketch plans for a 15-story building on the current land were presented, with Bro. Dupont as the architect. After considerable discussion, Worshipful Master W. W. Birchfield appointed a committee of 15 members to explore this concept, but ultimately, the idea faded away.
                </p>
              </div>
            </div>
            
            <div class="bg-primary-gold-light p-6 rounded-lg">
              <h4 class="font-cinzel text-lg font-bold text-primary-blue mb-4">Nitram Lodge Is Born</h4>
              <p class="text-gray-700 mb-4">
                In the same year, a new Masonic Lodge U.D. (Under Dispensation) was established, initially named Sunshine Lodge U.D. Operating in our Masonic Temple, the lodge later adopted the name Nitram Lodge #188 in memory of one of its first deceased members, Martin. The name "Nitram" was formed by spelling Martin backward.
              </p>
              
              <p class="text-gray-700">
                Nitram Lodge #188 was officially born, and its elected officers were jointly installed with St. Petersburg Lodge #139 officers on December 29, 1925. By the end of the year, St. Petersburg Lodge #139 had a membership of 491, raising 56 and affiliating 30, thus welcoming 86 new members in 1925.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 1930-1939: Troubled Times -->
      <div class="mb-16">
        <div class="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
          <div class="bg-gradient-to-r from-gray-700 to-gray-800 text-white p-6">
            <h3 class="font-cinzel text-2xl font-bold flex items-center">
              <i class="fas fa-cloud-rain text-primary-gold mr-3"></i>
              1930-1939: Troubled Times
            </h3>
            <p class="text-gray-300 mt-2 italic">
              "The only true happiness is to learn, to advance, and to improve; which could not happen unless we had commenced with error, ignorance, and imperfection. We must pass through the darkness, to reach the light."
            </p>
          </div>
          <div class="p-8">
            <h4 class="font-cinzel text-lg font-bold text-primary-blue mb-4">The Great Depression Reaches St.Petersburg</h4>
            
            <div class="space-y-6 text-gray-700">
              <div class="border-l-4 border-red-400 pl-6">
                <h5 class="font-bold text-red-600 mb-2">April 1930:</h5>
                <p>
                  The Lodge faced financial challenges and had to borrow money to meet the Grand Lodge per capita dues. Failing to pay would have meant no representation in that year's Grand Lodge. Despite this, we managed to pay our Grand Lodge dues, and the Grand Lodge convened in Tallahassee, FL. The Worshipful Master of that year made history by flying his airplane to Tallahassee, where Masons commemorated the first 100 years of Free Masonry in Florida.
                </p>
              </div>
              
              <div class="border-l-4 border-red-500 pl-6">
                <h5 class="font-bold text-red-600 mb-2">July 1930:</h5>
                <p>
                  The bank closure resulted in the freezing of $1,550 of Lodge funds, leading St. Petersburg Lodge #139 to default for the first and only time in its history on the initial note payment of $688 to the Acea Mutual Life Insurance Company. By October 7th, financial troubles escalated rapidly. A proposal to increase dues to $10.00 and life memberships to $250.00 was defeated.
                </p>
              </div>
              
              <div class="border-l-4 border-red-600 pl-6">
                <h5 class="font-bold text-red-600 mb-2">October 1930:</h5>
                <p>
                  Financial difficulties reached a peak. After multiple rejected motions and amendments to the By-Laws, Worshipful Master Lois F. Beard handed over the "gavel" to R.W.D.D.G.M. James D. Smith of Tarpon Lodge, who presided in the East. The facts revealed that 71 members held lifetime memberships and paid no dues, costing the Lodge $3.25 each in per capita tax.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 1940-1949: World War 2 -->
      <div class="mb-16">
        <div class="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
          <div class="bg-gradient-to-r from-red-700 to-blue-700 text-white p-6">
            <h3 class="font-cinzel text-2xl font-bold flex items-center">
              <i class="fas fa-flag-usa text-primary-gold mr-3"></i>
              1940-1949: World War 2 Reaches St.Petersburg
            </h3>
            <p class="text-gray-200 mt-2 italic">
              "Men are not prisoners of fate, but only prisoners of their own minds"
            </p>
          </div>
          <div class="p-8">
            <h4 class="font-cinzel text-lg font-bold text-primary-blue mb-4">World War 2 and Its Effect on St.Petersburg</h4>
            
            <p class="text-gray-700 mb-6">
              St. Petersburg underwent significant transformations during World War II, profoundly influenced by global events. The war clouds that swept across Europe in 1939 echoed in the Sunshine City, leading to civic changes and a dynamic impact on the local Masonic Lodge #139.
            </p>
            
            <div class="bg-blue-50 p-6 rounded-lg mb-6">
              <p class="text-gray-700 mb-4">
                The war years brought about a surge in population, with over 120,000 recruits and instructors visiting St. Petersburg. The local Masonic Lodge experienced increased attendance and participation, contributing actively to the war effort. The Lodge history reflects the dynamic period, marked by mortgage burnings, property transactions, and membership changes.
              </p>
            </div>
            
            <p class="text-gray-700">
              The war's end in 1945 ushered in celebrations, but St. Petersburg was forever changed. The legacies of World War II, reflected in population growth, economic shifts, and social changes, continue to shape the city's character. St. Petersburg's postwar trajectory illustrates the lasting impact of the war on local communities and their ability to adapt to global challenges.
            </p>
          </div>
        </div>
      </div>

      <!-- 1950-1959: Growth & Prosperity -->
      <div class="mb-16">
        <div class="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
          <div class="bg-gradient-to-r from-green-600 to-primary-blue text-white p-6">
            <h3 class="font-cinzel text-2xl font-bold flex items-center">
              <i class="fas fa-chart-line text-primary-gold mr-3"></i>
              1950-1959: Growth & Prosperity
            </h3>
            <p class="text-gray-200 mt-2 italic">
              "Courage is what it takes to stand up and speak; courage is also what it takes to sit down and listen."
            </p>
          </div>
          <div class="p-8">
            <h4 class="font-cinzel text-lg font-bold text-primary-blue mb-4">St.Petersburg Reborn</h4>
            
            <div class="bg-green-50 p-6 rounded-lg mb-6">
              <p class="text-gray-700 mb-4">
                In the aftermath of the war, St. Petersburg underwent a significant demographic shift, marked by substantial population growth. Starting with a population of 60,812 in 1940, the numbers surged to around 86,000 by 1945 and further expanded to 96,848 by the mid-20th century. Over the subsequent fifty years, the city burgeoned into a metropolis, boasting a population of nearly a quarter million residents.
              </p>
            </div>
            
            <h4 class="font-cinzel text-lg font-bold text-primary-blue mb-4">Lodge Construction Timeline</h4>
            
            <div class="bg-primary-gold-light p-6 rounded-lg">
              <div class="space-y-4">
                <div class="flex items-start space-x-4">
                  <div class="bg-primary-blue text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">52</div>
                  <div>
                    <p class="font-medium text-primary-blue">April 1952</p>
                    <p class="text-gray-700">The Lodge received recommendations for constructing a new Masonic Temple at the current location.</p>
                  </div>
                </div>
                
                <div class="flex items-start space-x-4">
                  <div class="bg-primary-blue text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">53</div>
                  <div>
                    <p class="font-medium text-primary-blue">February 1953</p>
                    <p class="text-gray-700">Plans accepted for demolishing the old Temple and constructing a new one, estimated at $219,350.</p>
                  </div>
                </div>
                
                <div class="flex items-start space-x-4">
                  <div class="bg-primary-gold text-primary-blue rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">56</div>
                  <div>
                    <p class="font-medium text-primary-blue">1956</p>
                    <p class="text-gray-700"><strong>Temple completion!</strong> Dedication ceremony on October 16th with 310 Masons and Grand Lodge Officers present. Peak membership: 1,256.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 1960-1969: A Decade in Transition -->
      <div class="mb-16">
        <div class="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
          <div class="bg-gradient-to-r from-purple-600 to-primary-blue-dark text-white p-6">
            <h3 class="font-cinzel text-2xl font-bold flex items-center">
              <i class="fas fa-exchange-alt text-primary-gold mr-3"></i>
              1960-1969: A Decade in Transition
            </h3>
            <p class="text-gray-200 mt-2 italic">
              "Ask not what your country can do for you, ask what you can do for your country"
            </p>
          </div>
          <div class="p-8">
            <h4 class="font-cinzel text-lg font-bold text-primary-blue mb-6">Decade in Transition: The 1960s</h4>
            
            <div class="space-y-6">
              <div class="border-l-4 border-primary-blue pl-6">
                <h5 class="font-bold text-primary-blue mb-2">1963:</h5>
                <p class="text-gray-700">
                  A spirited move to revamp the image of St. Petersburg led to the abolition of all green benches, marking a symbolic shift for the city. The Lodge took proactive steps by reaching out to the City for guidance on installing a new bench in front of the Temple.
                </p>
              </div>
              
              <div class="border-l-4 border-primary-gold pl-6">
                <h5 class="font-bold text-primary-blue mb-2">1965:</h5>
                <p class="text-gray-700">
                  A forward-thinking committee was formed on April 20th to explore the installation of an elevator in the Temple building. This vision became a reality on November 2nd when the Lodge entered into a contract with the Otis Elevator Co. for the purchase and installation of the elevator at a cost of $14,975.
                </p>
              </div>
              
              <div class="border-l-4 border-gray-500 pl-6">
                <h5 class="font-bold text-primary-blue mb-2">1968:</h5>
                <p class="text-gray-700">
                  The year marked both loss and necessary upkeep. The passing of Bro. A.A. Russell, who had faithfully served as Tyler for over 40 years, was mourned on January 14th. Essential maintenance included repairing the Temple roof, painting the fire escape, and caulking Temple windows.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="text-center bg-primary-blue text-white p-12 rounded-lg">
        <h3 class="font-cinzel text-3xl font-bold mb-6">Continue Our Legacy</h3>
        <p class="text-xl text-primary-gold-light mb-8">
          From 9 charter members in 1893 to over 1,200 at our peak, St. Petersburg Lodge No. 139 continues to serve our community with the same dedication and principles that guided our founders.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a routerLink="/becoming-mason" 
             class="bg-primary-gold hover:bg-primary-gold-light text-primary-blue-darker font-semibold px-8 py-3 rounded-lg transition inline-flex items-center">
            <i class="fas fa-handshake mr-2"></i>
            Learn About Becoming a Mason
          </a>
          <a routerLink="/contact" 
             class="border-2 border-white hover:border-primary-gold text-white hover:text-primary-gold px-8 py-3 rounded-lg transition inline-flex items-center">
            <i class="fas fa-envelope mr-2"></i>
            Contact Us
          </a>
        </div>
      </div>
    </div>
  `
})
export class HistoryComponent {}