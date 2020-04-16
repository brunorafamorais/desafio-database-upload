import { getRepository } from 'typeorm';

import Category from '../models/Category';

class CreateCategoryService {
  public async execute(title: string): Promise<Category> {
    const categoriesRepository = getRepository(Category);

    const findcategory = await categoriesRepository.findOne({
      where: { title },
    });

    if (!findcategory) {
      const category = await categoriesRepository.create({ title });

      await categoriesRepository.save(category);

      return category;
    }

    return findcategory;
  }
}

export default CreateCategoryService;
