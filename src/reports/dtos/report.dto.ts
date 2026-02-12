import { Expose, Transform } from 'class-transformer';

export class ReportDTO {
  @Expose()
  id: number;

  @Expose()
  approved: boolean;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  milage: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  price: number;

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}
