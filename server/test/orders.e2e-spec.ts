import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Orders (e2e)', () => {
  let app: INestApplication;
  let userToken: string;
  let adminToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

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

  it('user can create order when stock is available', async () => {
    const res = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ items: [{ productId: 1, quantity: 1 }] })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.items.length).toBeGreaterThan(0);
  });

  it('user cannot order more than stock', async () => {
    await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ items: [{ productId: 1, quantity: 9999 }] })
      .expect(400);
  });

  it('admin can fetch all orders', async () => {
    const res = await request(app.getHttpServer())
      .get('/orders/all')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });
});
