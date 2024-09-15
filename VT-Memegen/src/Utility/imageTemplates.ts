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
        { key: 'leftButton1', placeholder: 'Left Button', position: { top: '15%', left: '25%' } },
        { key: 'bottomText1', placeholder: 'Right Button', position: { top: '10%', left: '57%' } },
      ],
    },
    {
      src: '../../src/assets/template2.jpg',
      alt: 'Template 2',
      textAreas: [
        { key: 'leftText2', placeholder: 'Left Text', position: { top: '40%', left: '27%' } },
        { key: 'middleText2', placeholder: 'Middle Text', position: { top: '40%', left: '60%' } },
        { key: 'rightText2', placeholder: 'Right Text', position: { top: '30%', left: '85%' } },
      ],
    },
    {
        src: '../../src/assets/template3.jpg', // Replace with your image paths
        alt: 'Template 3',
        textAreas: [
          { key: 'bottomText3', placeholder: 'Bottom Text', position: { top: '90%', left: '50%' } },
        ],
      },
      {
        src: '../../src/assets/template4.jpg',
        alt: 'Template 4',
        textAreas: [
          { key: 'topLeftText4', placeholder: 'Top Left Text', position: { top: '35%', left: '20%' } },
          { key: 'topRightText4', placeholder: 'Top Right Text', position: { top: '15%', left: '80%' } },
          { key: 'bottomLeftText4', placeholder: 'Bottom Left Text', position: { top: '80%', left: '15%' } },
          { key: 'bottomMiddleText4', placeholder: 'Bottom Middle Text', position: { top: '80%', left: '50%' } },
          { key: 'bottomRightText4', placeholder: 'Bottom Right Text', position: { top: '67%', left: '90%' } }

        ],
      },
      {
        src: '../../src/assets/template5.jpg', // Replace with your image paths
        alt: 'Template 5',
        textAreas: [
          { key: 'leftText5', placeholder: 'Left Text', position: { top: '40%', left: '30%' } },
          { key: 'rightText5', placeholder: 'Right Text', position: { top: '10%', left: '70%' } },
        ],
      },
      {
        src: '../../src/assets/template6.jpg', // Replace with your image paths
        alt: 'Template 6',
        textAreas: [
          { key: 'topText6', placeholder: 'Top Text', position: { top: '10%', left: '70%' } },
          { key: 'bottomText6', placeholder: 'Bottom Text', position: { top: '60%', left: '70%' } },
        ],
      },
      {
        src: '../../src/assets/template7.jpg', // Replace with your image paths
        alt: 'Template 7',
        textAreas: [
          { key: 'topText7', placeholder: 'Top Text', position: { top: '25%', left: '25%' } },
          { key: 'bottomText7', placeholder: 'Bottom Text', position: { top: '70%', left: '25%' } },
        ],
      },
      {
        src: '../../src/assets/template8.jpg', // Replace with your image paths
        alt: 'Template 8',
        textAreas: [
          { key: 'leftText8', placeholder: 'Left Text', position: { top: '20%', left: '20%' } },
          { key: 'rightText8', placeholder: 'Right Text', position: { top: '10%', left: '80%' } },
        ],
      },
      {
        src: '../../src/assets/template9.jpg', // Replace with your image paths
        alt: 'Template 9',
        textAreas: [
          { key: 'leftText9', placeholder: 'Left Text', position: { top: '20%', left: '25%' } },
          { key: 'rightText9', placeholder: 'Right Text', position: { top: '20%', left: '70%' } },
          { key: 'bottomText9', placeholder: 'Bottom Text', position: { top: '60%', left: '60%' } }
        ],
      },
      {
        src: '../../src/assets/template10.jpg', // Replace with your image paths
        alt: 'Template 10',
        textAreas: [
          { key: 'leftText10', placeholder: 'Left Text', position: { top: '30%', left: '20%' } },
          { key: 'rightText10', placeholder: 'Right Text', position: { top: '30%', left: '75%' } },
          { key: 'bottomText10', placeholder: 'Bottom Text', position: { top: '40%', left: '50%' } }
        ],
      },
      {
        src: '../../src/assets/template11.jpg', // Replace with your image paths
        alt: 'Template 11',
        textAreas: [
          { key: 'leftText11', placeholder: 'Left Text', position: { top: '5%', left: '25%' } },
          { key: 'rightText11', placeholder: 'Right Text', position: { top: '15%', left: '80%' } }
        ],
      },
      {
        src: '../../src/assets/template12.jpg', // Replace with your image paths
        alt: 'Template 12',
        textAreas: [
          { key: 'leftText12', placeholder: 'Left Text', position: { top: '5%', left: '25%' } },
          { key: 'rightText12', placeholder: 'Right Text', position: { top: '15%', left: '80%' } }
        ],
      },
      {
        src: '../../src/assets/template13.jpg', // Replace with your image paths
        alt: 'Template 13',
        textAreas: [
          { key: 'headacheText13', placeholder: 'Headache Text', position: { top: '65%', left: '70%' } }
        ],
      },
      {
        src: '../../src/assets/template14.jpg', // Replace with your image paths
        alt: 'Template 14',
        textAreas: [
          { key: 'topLeftText14', placeholder: 'Top Left Text', position: { top: '10%', left: '20%' } },
          { key: 'topRightText14', placeholder: 'Top Right Text', position: { top: '10%', left: '70%' } },
          { key: 'womenText14', placeholder: 'Women Text', position: { top: '35%', left: '20%' } },
          { key: 'catText14', placeholder: 'Cat Text', position: { top: '50%', left: '80%' } }      
        ],
      },
      {
        src: '../../src/assets/template15.jpg', // Replace with your image paths
        alt: 'Template 15',
        textAreas: [
          { key: 'leftText15', placeholder: 'Left Text', position: { top: '5%', left: '25%' } },
          { key: 'rightText15', placeholder: 'Right Text', position: { top: '5%', left: '80%' } },
          { key: 'robinText15', placeholder: 'Robin Text', position: { top: '60%', left: '40%' } },
          { key: 'batmanText15', placeholder: 'Batman Text', position: { top: '40%', left: '70%' } }
        ],
      },
      {
        src: '../../src/assets/template16.jpg', // Replace with your image paths
        alt: 'Template 16',
        textAreas: [
          { key: 'houseText16', placeholder: 'House Text', position: { top: '30%', left: '25%' } },
          { key: 'girlText16', placeholder: 'Girl Text', position: { top: '40%', left: '70%' } }
        ],
      },
      {
        src: '../../src/assets/template17.jpg', // Replace with your image paths
        alt: 'Template 17',
        textAreas: [
          { key: 'straightText17', placeholder: 'Straight Road Text', position: { top: '20%', left: '30%' } },
          { key: 'rightText17', placeholder: 'Right Road Text', position: { top: '20%', left: '60%' } }
        ],
      },
      {
        src: '../../src/assets/template18.jpg', // Replace with your image paths
        alt: 'Template 18',
        textAreas: [
          { key: 'topText18', placeholder: 'Top Text', position: { top: '10%', left: '25%' } },
          { key: 'girlText16', placeholder: 'Girl Text', position: { top: '20%', left: '20%' } }
        ],
      },
      {
        src: '../../src/assets/template19.jpg', // Replace with your image paths
        alt: 'Template 19',
        textAreas: [
          { key: 'topLeftText19', placeholder: 'Top Left Text', position: { top: '20%', left: '40%' } },
          { key: 'topRightText19', placeholder: 'Top Right Text', position: { top: '25%', left: '90%' } },
          { key: 'bottomLeftText19', placeholder: 'Bottom Left Text', position: { top: '70%', left: '35%' } },
          { key: 'bottomRightText19', placeholder: 'Bottom Right Text', position: { top: '70%', left: '90%' } }
        ],
      },
      {
        src: '../../src/assets/template20.jpg', // Replace with your image paths
        alt: 'Template 20',
        textAreas: [
          { key: 'guyText20', placeholder: 'Guy Text', position: { top: '30%', left: '25%' } },
          { key: 'butterFlyText20', placeholder: 'Butterfly Text', position: { top: '30%', left: '80%' } },
          { key: 'bottomText20', placeholder: 'Bottom Text', position: { top: '90%', left: '50%' } }
        ],
      },
    
    // Add more templates as needed
  ];
  