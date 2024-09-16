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
      src: 'https://firebasestorage.googleapis.com/v0/b/vthacks12-6ce70.appspot.com/o/assets%2Ftemplate1.jpg?alt=media&token=dd014788-9500-46a1-bad9-48d45229cb7b', // Replace with your image paths
      alt: 'Template 1',
      textAreas: [
        { key: 'leftButton1', placeholder: 'Left Button', position: { top: '15%', left: '25%' } },
        { key: 'bottomText1', placeholder: 'Right Button', position: { top: '10%', left: '57%' } },
      ],
    },
    {
      src: 'https://firebasestorage.googleapis.com/v0/b/vthacks12-6ce70.appspot.com/o/assets%2Ftemplate2.jpg?alt=media&token=01c3471d-b4ab-4df6-bfc7-5714c2caf5f7',
      alt: 'Template 2',
      textAreas: [
        { key: 'leftText2', placeholder: 'Left Text', position: { top: '40%', left: '27%' } },
        { key: 'middleText2', placeholder: 'Middle Text', position: { top: '40%', left: '60%' } },
        { key: 'rightText2', placeholder: 'Right Text', position: { top: '30%', left: '85%' } },
      ],
    },
    {
        src: 'https://firebasestorage.googleapis.com/v0/b/vthacks12-6ce70.appspot.com/o/assets%2Ftemplate3.jpg?alt=media&token=ae93ea37-e83f-4840-8b71-4595727f51d7', // Replace with your image paths
        alt: 'Template 3',
        textAreas: [
          { key: 'bottomText3', placeholder: 'Bottom Text', position: { top: '90%', left: '50%' } },
        ],
      },
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/vthacks12-6ce70.appspot.com/o/assets%2Ftemplate4.jpg?alt=media&token=2242dbc1-9558-4eeb-a89b-c0086f1d544d',
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
        src: 'https://firebasestorage.googleapis.com/v0/b/vthacks12-6ce70.appspot.com/o/assets%2Ftemplate5.jpg?alt=media&token=0af8ef8c-e9eb-462c-a6ef-e1580dbe09af', // Replace with your image paths
        alt: 'Template 5',
        textAreas: [
          { key: 'leftText5', placeholder: 'Left Text', position: { top: '40%', left: '30%' } },
          { key: 'rightText5', placeholder: 'Right Text', position: { top: '10%', left: '70%' } },
        ],
      },
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/vthacks12-6ce70.appspot.com/o/assets%2Ftemplate6.jpg?alt=media&token=d71c9f23-be77-4807-92c0-473bad526d1d', // Replace with your image paths
        alt: 'Template 6',
        textAreas: [
          { key: 'topText6', placeholder: 'Top Text', position: { top: '10%', left: '70%' } },
          { key: 'bottomText6', placeholder: 'Bottom Text', position: { top: '60%', left: '70%' } },
        ],
      },
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/vthacks12-6ce70.appspot.com/o/assets%2Ftemplate7.jpg?alt=media&token=107e32b1-72b0-4ba4-ac0a-c435b222d91a', // Replace with your image paths
        alt: 'Template 7',
        textAreas: [
          { key: 'topText7', placeholder: 'Top Text', position: { top: '25%', left: '25%' } },
          { key: 'bottomText7', placeholder: 'Bottom Text', position: { top: '70%', left: '25%' } },
        ],
      },
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/vthacks12-6ce70.appspot.com/o/assets%2Ftemplate8.jpg?alt=media&token=a275c539-82d0-4309-b176-69e901d7a54e', // Replace with your image paths
        alt: 'Template 8',
        textAreas: [
          { key: 'leftText8', placeholder: 'Left Text', position: { top: '20%', left: '20%' } },
          { key: 'rightText8', placeholder: 'Right Text', position: { top: '10%', left: '80%' } },
        ],
      },
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/vthacks12-6ce70.appspot.com/o/assets%2Ftemplate9.jpg?alt=media&token=583552e0-8366-4cee-9dc9-f3085c0c415f', // Replace with your image paths
        alt: 'Template 9',
        textAreas: [
          { key: 'leftText9', placeholder: 'Left Text', position: { top: '20%', left: '25%' } },
          { key: 'rightText9', placeholder: 'Right Text', position: { top: '20%', left: '70%' } },
          { key: 'bottomText9', placeholder: 'Bottom Text', position: { top: '60%', left: '60%' } }
        ],
      },
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/vthacks12-6ce70.appspot.com/o/assets%2Ftemplate10.jpg?alt=media&token=d15b6d06-a030-4de7-abea-212206505bd3', // Replace with your image paths
        alt: 'Template 10',
        textAreas: [
          { key: 'leftText10', placeholder: 'Left Text', position: { top: '30%', left: '20%' } },
          { key: 'rightText10', placeholder: 'Right Text', position: { top: '30%', left: '75%' } },
          { key: 'bottomText10', placeholder: 'Bottom Text', position: { top: '40%', left: '50%' } }
        ],
      },
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/vthacks12-6ce70.appspot.com/o/assets%2Ftemplate11.jpg?alt=media&token=a74710e4-8180-4825-b217-1a25986f43ff', // Replace with your image paths
        alt: 'Template 11',
        textAreas: [
          { key: 'leftText11', placeholder: 'Left Text', position: { top: '5%', left: '25%' } },
          { key: 'rightText11', placeholder: 'Right Text', position: { top: '15%', left: '80%' } }
        ],
      },
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/vthacks12-6ce70.appspot.com/o/assets%2Ftemplate12.jpg?alt=media&token=79271b15-2524-4d09-bc4c-b0bb9e019bfa', // Replace with your image paths
        alt: 'Template 12',
        textAreas: [
          { key: 'leftText12', placeholder: 'Left Text', position: { top: '5%', left: '25%' } },
          { key: 'rightText12', placeholder: 'Right Text', position: { top: '15%', left: '80%' } }
        ],
      },
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/vthacks12-6ce70.appspot.com/o/assets%2Ftemplate13.jpg?alt=media&token=8be4de92-d076-4e03-b797-7b18f079d948', // Replace with your image paths
        alt: 'Template 13',
        textAreas: [
          { key: 'headacheText13', placeholder: 'Headache Text', position: { top: '65%', left: '70%' } }
        ],
      },
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/vthacks12-6ce70.appspot.com/o/assets%2Ftemplate14.jpg?alt=media&token=e9ae9548-c3b0-4720-b02c-1eaf922ae3c7', // Replace with your image paths
        alt: 'Template 14',
        textAreas: [
          { key: 'topLeftText14', placeholder: 'Top Left Text', position: { top: '10%', left: '20%' } },
          { key: 'topRightText14', placeholder: 'Top Right Text', position: { top: '10%', left: '70%' } },
          { key: 'womenText14', placeholder: 'Women Text', position: { top: '35%', left: '20%' } },
          { key: 'catText14', placeholder: 'Cat Text', position: { top: '50%', left: '80%' } }      
        ],
      },
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/vthacks12-6ce70.appspot.com/o/assets%2Ftemplate15.jpg?alt=media&token=e0440169-e128-4479-b524-88ba64c36d4d', // Replace with your image paths
        alt: 'Template 15',
        textAreas: [
          { key: 'leftText15', placeholder: 'Left Text', position: { top: '5%', left: '25%' } },
          { key: 'rightText15', placeholder: 'Right Text', position: { top: '5%', left: '80%' } },
          { key: 'robinText15', placeholder: 'Robin Text', position: { top: '60%', left: '40%' } },
          { key: 'batmanText15', placeholder: 'Batman Text', position: { top: '40%', left: '70%' } }
        ],
      },
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/vthacks12-6ce70.appspot.com/o/assets%2Ftemplate16.jpg?alt=media&token=6fe23719-9551-4468-9e7b-93a78c26f52e', // Replace with your image paths
        alt: 'Template 16',
        textAreas: [
          { key: 'houseText16', placeholder: 'House Text', position: { top: '30%', left: '25%' } },
          { key: 'girlText16', placeholder: 'Girl Text', position: { top: '40%', left: '70%' } }
        ],
      },
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/vthacks12-6ce70.appspot.com/o/assets%2Ftemplate17.jpg?alt=media&token=5543d4a8-1c76-4690-bbda-6a9d288a25d5', // Replace with your image paths
        alt: 'Template 17',
        textAreas: [
          { key: 'straightText17', placeholder: 'Straight Road Text', position: { top: '20%', left: '30%' } },
          { key: 'rightText17', placeholder: 'Right Road Text', position: { top: '20%', left: '60%' } }
        ],
      },
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/vthacks12-6ce70.appspot.com/o/assets%2Ftemplate18.jpg?alt=media&token=b0ea1518-4699-442f-a509-2e3c53792015', // Replace with your image paths
        alt: 'Template 18',
        textAreas: [
          { key: 'topText18', placeholder: 'Top Text', position: { top: '10%', left: '25%' } },
          { key: 'girlText16', placeholder: 'Girl Text', position: { top: '20%', left: '20%' } }
        ],
      },
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/vthacks12-6ce70.appspot.com/o/assets%2Ftemplate19.jpg?alt=media&token=eda0bb54-7a08-4ac3-8229-bf30732dec4b', // Replace with your image paths
        alt: 'Template 19',
        textAreas: [
          { key: 'topLeftText19', placeholder: 'Top Left Text', position: { top: '20%', left: '40%' } },
          { key: 'topRightText19', placeholder: 'Top Right Text', position: { top: '25%', left: '90%' } },
          { key: 'bottomLeftText19', placeholder: 'Bottom Left Text', position: { top: '70%', left: '35%' } },
          { key: 'bottomRightText19', placeholder: 'Bottom Right Text', position: { top: '70%', left: '90%' } }
        ],
      },
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/vthacks12-6ce70.appspot.com/o/assets%2Ftemplate20.jpg?alt=media&token=4e4d0451-989a-4984-9269-c442ca9965bd', // Replace with your image paths
        alt: 'Template 20',
        textAreas: [
          { key: 'guyText20', placeholder: 'Guy Text', position: { top: '30%', left: '25%' } },
          { key: 'butterFlyText20', placeholder: 'Butterfly Text', position: { top: '30%', left: '80%' } },
          { key: 'bottomText20', placeholder: 'Bottom Text', position: { top: '90%', left: '50%' } }
        ],
      },
    
    // Add more templates as needed
  ];
  