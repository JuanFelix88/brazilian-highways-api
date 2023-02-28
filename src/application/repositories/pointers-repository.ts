import { KeyPointer } from '../entities/key-pointer';

export abstract class PointersRepository {
  abstract create(pointer: Partial<KeyPointer>): Promise<{ id: number }>
  abstract insertMany(pointers: Array<Partial<KeyPointer>>): Promise<boolean>
  abstract findByHighwayId(highwayId: number): Promise<KeyPointer[]>
}
