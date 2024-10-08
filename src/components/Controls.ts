import { characterOptions, traditionalCharacterOptions } from '../constants';

export class Controls {
  private updateCallback: () => void;
  private characterSetSelect: HTMLSelectElement;
  private selectedCharacters: string[];

  constructor(updateCallback: () => void) {
    this.updateCallback = updateCallback;
    this.characterSetSelect = document.createElement('select');
    this.selectedCharacters = characterOptions.map(options => options[0]);
    this.createSelectionBoxes();
  }

  private createSelectionBoxes() {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '10px';
    container.style.left = '10px';
    container.style.zIndex = '1000';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    document.body.appendChild(container);

    // Add character set toggle
    this.characterSetSelect.id = 'characterSet';
    this.characterSetSelect.style.margin = '5px';
    this.characterSetSelect.style.padding = '5px';
    this.characterSetSelect.style.fontSize = '16px';

    const simplifiedOption = document.createElement('option');
    simplifiedOption.value = 'simplified';
    simplifiedOption.textContent = '简体';
    this.characterSetSelect.appendChild(simplifiedOption);

    const traditionalOption = document.createElement('option');
    traditionalOption.value = 'traditional';
    traditionalOption.textContent = '繁體';
    this.characterSetSelect.appendChild(traditionalOption);

    this.characterSetSelect.addEventListener('change', () => {
      this.updateCharacterOptions();
      this.updateCallback();
    });
    container.appendChild(this.characterSetSelect);

    // Add cube count selection box
    const cubeCountSelect = document.createElement('select');
    cubeCountSelect.id = 'cubeCount';
    cubeCountSelect.style.margin = '5px';
    cubeCountSelect.style.padding = '5px';
    cubeCountSelect.style.fontSize = '16px';
    container.appendChild(cubeCountSelect);

    // Add options to the cube count selection box
    const options = [1, 2, 3, 4, 5, 6, 7, 8];
    options.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option.toString();
      optionElement.textContent = `${option} cube${option > 1 ? 's' : ''}`;
      cubeCountSelect.appendChild(optionElement);
    });

    // Set default selection to 3 cubes
    cubeCountSelect.value = '3';

    // Add character selection boxes
    for (let i = 0; i < 6; i++) {
      const select = document.createElement('select');
      select.id = `character-${i}`;
      select.style.margin = '5px';
      select.style.padding = '5px';
      select.style.fontSize = '16px';
      container.appendChild(select);
    }

    this.updateCharacterOptions();

    cubeCountSelect.addEventListener('change', this.updateCallback);
  }

  private updateCharacterOptions() {
    const isTraditional = this.characterSetSelect.value === 'traditional';
    const currentOptions = isTraditional ? traditionalCharacterOptions : characterOptions;

    currentOptions.forEach((options, index) => {
      const select = document.getElementById(`character-${index}`) as HTMLSelectElement;
      if (select) {
        select.innerHTML = '';

        options.forEach(char => {
          const option = document.createElement('option');
          option.value = char;
          option.textContent = char;
          select.appendChild(option);
        });

        select.value = this.selectedCharacters[index];
        select.onchange = (e) => {
          if (e.target instanceof HTMLSelectElement) {
            this.selectedCharacters[index] = e.target.value;
            this.updateCallback();
          }
        };
      }
    });
  }

  getCubeCount(): number {
    const cubeCountSelect = document.getElementById('cubeCount') as HTMLSelectElement;
    return cubeCountSelect ? parseInt(cubeCountSelect.value) : 3; // Default to 3 if element not found
  }

  getCharacterSet(): 'simplified' | 'traditional' {
    return this.characterSetSelect.value as 'simplified' | 'traditional';
  }

  getSelectedCharacters(): string[] {
    return this.selectedCharacters;
  }
}