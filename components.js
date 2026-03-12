class JobExperience extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title');
    const company = this.getAttribute('company');
    const date = this.getAttribute('date');
    const content = this.innerHTML;

    const [start, end] = date.split(' - ').map(s => s.trim());

    const formatIso = (d) => {
      if (!d || d.toLowerCase() === 'present') return '';
      const parts = d.split('/');
      return parts.length === 2 ? `${parts[1]}-${parts[0]}-01` : d;
    };

    const startIso = formatIso(start);
    const endIso = formatIso(end);

    const startHtml = startIso ? `<time datetime="${startIso}">${start}</time>` : start;
    const endHtml = endIso ? `<time datetime="${endIso}">${end}</time>` : end;

    this.innerHTML = `
      <article class="pb-4">
        <div class="flex justify-between items-start mb-0.5">
          <h4 class="text-[11pt] font-extrabold text-gray-800 uppercase">${title}</h4>
          <span class="text-[10pt] font-medium text-gray-500 whitespace-nowrap ml-4">${startHtml} - ${endHtml}</span>
        </div>
        <h5 class="text-[10pt] font-medium text-gray-600 mb-1">${company}</h5>
        <ul class="list-disc pl-4 text-[10pt] text-gray-600 space-y-1 leading-relaxed">
          ${content}
        </ul>
      </article>
    `;

  }
}

customElements.define('job-experience', JobExperience);

class SkillGroup extends HTMLElement {
  connectedCallback() {
    const contentHtml = this.innerHTML;
    const temp = document.createElement('div');
    temp.innerHTML = contentHtml;
    const lis = temp.querySelectorAll('li');

    // Icon mode: if any <li> has an icon attribute, render as icon+label rows
    const hasIcons = Array.from(lis).some(li => li.hasAttribute('icon'));

    if (hasIcons) {
      const rowsHtml = Array.from(lis).map(li => {
        const icon = li.getAttribute('icon') || 'fa-circle-check';
        const label = li.textContent.trim();
        return `
          <li class="flex items-center gap-2 py-1.5 border-b border-dashed border-gray-300 last:border-b-0">
            <div class="w-5 flex-shrink-0 text-center">
              <i class="fa-solid ${icon} text-gray-700 text-[13px]"></i>
            </div>
            <span class="text-[11px] font-semibold text-gray-800">${label}</span>
          </li>
        `;
      }).join('');

      this.innerHTML = `<ul>${rowsHtml}</ul>`;
    } else {
      // Pill-badge mode (default)
      let items = [];
      if (lis.length > 0) {
        lis.forEach(li => items.push(li.textContent.trim()));
      } else {
        items = contentHtml.split(',').map(item => item.trim()).filter(Boolean);
      }

      const lisHtml = items.map(item => `
        <li class="bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-md text-[11px] font-medium whitespace-nowrap">${item}</li>
      `).join('');

      this.innerHTML = `<ul class="flex flex-wrap gap-2">${lisHtml}</ul>`;
    }
  }
}

customElements.define('skill-group', SkillGroup);

class LanguageItem extends HTMLElement {
  connectedCallback() {
    const language = this.getAttribute('language');
    const fluency = this.getAttribute('fluency');
    const level = parseInt(this.getAttribute('level') || '5', 10);

    const dots = Array.from({ length: 5 }, (_, i) => {
      const filled = i < level;
      return `<span class="inline-block w-[10px] h-[10px] rounded-full ${filled ? 'bg-gray-600' : 'bg-gray-300'}"></span>`;
    }).join('');

    this.innerHTML = `
      <div class="flex justify-between items-center">
        <div class="flex flex-col justify-center">
          <span class="text-[11px] font-bold text-gray-800">${language}</span>
          <span class="text-[10px] text-gray-500">${fluency}</span>
        </div>
        <div class="flex gap-1">${dots}</div>
      </div>
    `;
  }
}

customElements.define('language-item', LanguageItem);

class EducationItem extends HTMLElement {
  connectedCallback() {
    const degree = this.getAttribute('degree');
    const field = this.getAttribute('field');
    const institution = this.getAttribute('institution');
    const date = this.getAttribute('date');
    const degreeLink = this.getAttribute('degree-link');
    const institutionLink = this.getAttribute('institution-link');
    const content = this.innerHTML.trim();

    const degreeHtml = degreeLink
      ? `<a href="${degreeLink}" target="_blank" class="hover:underline">${degree}</a>`
      : degree;
    const institutionHtml = institutionLink
      ? `<a href="${institutionLink}" target="_blank" class="hover:underline">${institution}</a>`
      : institution;

    this.innerHTML = `
      <div>
        <div class="flex justify-between items-start">
          <h4 class="text-[11px] font-bold text-gray-800">${degreeHtml}</h4>
          <time class="text-[10px] text-gray-400 italic whitespace-nowrap ml-4">${date}</time>
        </div>
        ${field ? `<p class="text-[11px] text-gray-500 mt-0.5">${field}</p>` : ''}
        <p class="text-[11px] text-gray-500 mt-0.5">${institutionHtml}</p>
        ${content ? `<ul class="list-disc pl-4 text-[10px] text-gray-600 space-y-0.5 mt-1">${content}</ul>` : ''}
      </div>
    `;
  }
}

customElements.define('education-item', EducationItem);

class ProfileInfo extends HTMLElement {
  connectedCallback() {
    const icon = this.getAttribute('icon');
    const value = this.getAttribute('value');
    const label = this.getAttribute('label');
    const link = this.getAttribute('link');

    const displayValue = link
      ? `<a href="${link}" target="_blank" class="hover:underline transition-all duration-200">${value}</a>`
      : value;

    this.innerHTML = `
      <div class="flex items-end text-[11px] mb-2">
        <span class="w-6 text-black text-center mb-1" title="${label || ''}"><i class="fa-solid ${icon}"></i></span>
        <span class="flex-1 border-b border-black pb-1 pl-2 font-semibold text-gray-800">${displayValue}</span>
      </div>
    `;
  }
}

customElements.define('profile-info', ProfileInfo);

class SectionHeader extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title');

    this.innerHTML = `
      <div class="flex items-center gap-4">
        <h3 class="text-[12pt] font-extrabold tracking-widest uppercase text-black whitespace-nowrap">${title}</h3>
        <div class="h-[1px] bg-black flex-1"></div>
      </div>
    `;
  }
}

customElements.define('section-header', SectionHeader);

class AchievementItem extends HTMLElement {
  connectedCallback() {
    const icon = this.getAttribute('icon') || 'fa-star';
    const title = this.getAttribute('title') || '';
    const description = this.innerHTML.trim();

    this.innerHTML = `
      <div class="flex items-start gap-2 border-b border-dashed border-gray-300 last:border-b-0">
        <div class="mt-0.5 w-5 flex-shrink-0 text-center">
          <i class="fa-solid ${icon} text-gray-700 text-[16px]"></i>
        </div>
        <div class="flex flex-col gap-0.5">
          <span class="text-[11px] font-bold text-gray-800">${title}</span>
          <span class="text-[10px] text-gray-500 leading-snug">${description}</span>
        </div>
      </div>
    `;
  }
}

customElements.define('achievement-item', AchievementItem);
