export type BeanType = {
  beanId: string;
  flavorName: string;
  imageUrl: string;
  description: string;
};
export type BeanCard = {
  beanId: string;
  groupName: string[];
  ingredients: string[];
  flavorName: string;
  description: string;
  colorGroup: string;
  backgroundColor: string;
  imageUrl: string;
  glutenFree: boolean;
  sugarFree: boolean;
  seasonal: boolean;
  kosher: boolean;
};
