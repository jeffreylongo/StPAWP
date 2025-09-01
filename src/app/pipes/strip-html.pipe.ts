import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stripHtml',
  standalone: true
})
export class StripHtmlPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    
    // Remove WordPress Visual Composer shortcodes
    let cleaned = value
      .replace(/\[vc_row\].*?\[\/vc_row\]/gs, '') // Remove vc_row blocks
      .replace(/\[vc_column\].*?\[\/vc_column\]/gs, '') // Remove vc_column blocks
      .replace(/\[vc_column_text.*?\].*?\[\/vc_column_text\]/gs, '') // Remove vc_column_text blocks
      .replace(/\[.*?\]/g, '') // Remove any remaining shortcodes
      .replace(/<div[^>]*>.*?<\/div>/gs, '') // Remove div tags and their content
      .replace(/<p[^>]*>.*?<\/p>/gs, '') // Remove p tags and their content
      .replace(/<h[1-6][^>]*>.*?<\/h[1-6]>/gs, '') // Remove heading tags
      .replace(/<[^>]*>/g, '') // Remove any remaining HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with spaces
      .replace(/&amp;/g, '&') // Replace &amp; with &
      .replace(/&lt;/g, '<') // Replace &lt; with <
      .replace(/&gt;/g, '>') // Replace &gt; with >
      .replace(/&quot;/g, '"') // Replace &quot; with "
      .replace(/&#8220;/g, '"') // Replace &#8220; with "
      .replace(/&#8221;/g, '"') // Replace &#8221; with "
      .replace(/&#8243;/g, '"') // Replace &#8243; with "
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
    
    return cleaned;
  }
}

@Pipe({
  name: 'cleanWordPressContent',
  standalone: true
})
export class CleanWordPressContentPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    
    // Convert Visual Composer shortcodes to proper HTML
    let cleaned = value
      // Convert vc_column_text to paragraphs
      .replace(/\[vc_column_text[^\]]*\]/g, '<p>')
      .replace(/\[\/vc_column_text\]/g, '</p>')
      // Remove vc_row and vc_column wrappers
      .replace(/\[vc_row\].*?\[\/vc_row\]/gs, (match) => {
        // Extract content between vc_row tags, removing vc_column wrappers
        return match.replace(/\[vc_column[^\]]*\]/g, '').replace(/\[\/vc_column\]/g, '');
      })
      // Remove any remaining shortcodes
      .replace(/\[[^\]]*\]/g, '')
      // Remove the specific repetitive quote (multiple variations)
      .replace(/It really goes without saying….If you miss a meeting, you miss a Fantastic Meal!!/g, '')
      .replace(/It really goes without saying\.\.\.If you miss a meeting, you miss a Fantastic Meal!!/g, '')
      .replace(/It really goes without saying.*?If you miss a meeting, you miss a Fantastic Meal!!/g, '')
      .replace(/It really goes without saying.*?Fantastic Meal!!/g, '')
      // Clean up HTML entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#8220;/g, '"')
      .replace(/&#8221;/g, '"')
      .replace(/&#8243;/g, '"')
      // Format content into proper paragraphs
      .replace(/We had a very interesting Stated Communication on 20 May\./g, '<p class="mb-4"><strong>We had a very interesting Stated Communication on 20 May.</strong></p>')
      .replace(/After opening in the Master Mason Degree, the Worshipful Master dropped down to the Entered Apprentice Degree to permit any Mason the ability to partake of the discussion concerning Masonic Landmarks\. Brother Malek Chevalier, one of our EAs, attended and later stated that he learned quite a lot and was looking forward to the next time he could attend such a presentation\./g, '<p class="mb-4">After opening in the Master Mason Degree, the Worshipful Master dropped down to the Entered Apprentice Degree to permit any Mason the ability to partake of the discussion concerning Masonic Landmarks. Brother Malek Chevalier, one of our EAs, attended and later stated that he learned quite a lot and was looking forward to the next time he could attend such a presentation.</p>')
      .replace(/Right Worshipful Oran Ellis gave a very moving presentation on the Volume of Sacred Law Landmark/g, '<p class="mb-4">Right Worshipful Oran Ellis gave a very moving presentation on the Volume of Sacred Law Landmark</p>')
      .replace(/After returning to the Master Mason Degree, the Craft approved the By-law change to Section 1\.01 which corrects the Lodge address\./g, '<p class="mb-4">After returning to the Master Mason Degree, the Craft approved the By-law change to Section 1.01 which corrects the Lodge address.</p>')
      .replace(/In addition to other business, you missed Brother Jeff Longo receiving a certificate from Grand Lodge honoring his completion of the MM1 course\./g, '<p class="mb-4">In addition to other business, you missed Brother Jeff Longo receiving a certificate from Grand Lodge honoring his completion of the MM1 course.</p>')
      .replace(/You also missed the 40 Year Longevity Award presented to Worshipful John Gunter and the 55 Year Longevity Award presented to Worshipful John Gicking\./g, '<p class="mb-4">You also missed the 40 Year Longevity Award presented to Worshipful John Gunter and the 55 Year Longevity Award presented to Worshipful John Gicking.</p>')
      // Clean up extra whitespace
      .replace(/\s+/g, ' ')
      .trim();
    
    return cleaned;
  }
}
