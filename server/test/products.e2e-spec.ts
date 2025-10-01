import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Products (e2e)', () => {
  let app: INestApplication;
  let userToken: string;
  let adminToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    // login seeded users
    const userRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'user@shop.com', password: 'user123' });
    userToken = userRes.body.accessToken;

    const adminRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@shop.com', password: 'admin123' });
    adminToken = adminRes.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('user can fetch products', async () => {
    const res = await request(app.getHttpServer()).get('/products').expect(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('user cannot create product', async () => {
    await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ title: 'Phone', price: 200, inventory: 10 })
      .expect(403);
  });

  it('admin can create product', async () => {
    const res = await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Laptop', price: 1500, inventory: 5 })
      .expect(201);

    expect(res.body).toHaveProperty('id');
  });
});
