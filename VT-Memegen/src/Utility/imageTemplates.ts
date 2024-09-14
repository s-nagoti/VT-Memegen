// imageTemplates.ts
export interface TextArea {
    key: string;
    placeholder: string;
    position: {
      top: string;
      left: string;
    };
  }
  
  export interface ImageTemplate {
    src: string;
    alt: string;
    textAreas: TextArea[];
  }
  
  export const imageTemplates: ImageTemplate[] = [
    {
      src: '../../src/assets/template1.jpg', // Replace with your image paths
      alt: 'Template 1',
      textAreas: [
        { key: 'leftButton', placeholder: 'Left Button', position: { top: '15%', left: '25%' } },
        { key: 'bottomText', placeholder: 'Right Button', position: { top: '10%', left: '60%' } },
      ],
    },
    {
      src: '../../src/assets/template2.jpg',
      alt: 'Template 2',
      textAreas: [
        { key: 'leftText', placeholder: 'Left Text', position: { top: '40%', left: '27%' } },
        { key: 'middleText', placeholder: 'Middle Text', position: { top: '40%', left: '60%' } },
        { key: 'rightText', placeholder: 'Right Text', position: { top: '40%', left: '80%' } },
      ],
    },
    {
        src: '../../src/assets/template3.jpg', // Replace with your image paths
        alt: 'Template 3',
        textAreas: [
          { key: 'bottomText', placeholder: 'Bottom Text', position: { top: '90%', left: '50%' } },
        ],
      },
      {
        src: '../../src/assets/template4.jpg',
        alt: 'Template 4',
        textAreas: [
          { key: 'topLeftText', placeholder: 'Top Left Text', position: { top: '35%', left: '20%' } },
          { key: 'topRightText', placeholder: 'Top Right Text', position: { top: '20%', left: '80%' } },
          { key: 'bottomLeftText', placeholder: 'Bottom Left Text', position: { top: '80%', left: '15%' } },
          { key: 'bottomMiddleText', placeholder: 'Bottom Middle Text', position: { top: '80%', left: '50%' } },
          { key: 'bottomRightText', placeholder: 'Bottom Right Text', position: { top: '67%', left: '90%' } },

        ],
      },
      {
        src: '../../src/assets/template5.jpg', // Replace with your image paths
        alt: 'Template 5',
        textAreas: [
          { key: 'leftText', placeholder: 'Left Text', position: { top: '40%', left: '35%' } },
          { key: 'rightText', placeholder: 'Right Text', position: { top: '5%', left: '70%' } },
        ],
      },
    
    // Add more templates as needed
  ];
  