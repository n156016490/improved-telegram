import { Module } from "@nestjs/common";
import { HealthModule } from "@backend/modules/health/health.module";

@Module({
  imports: [HealthModule],
})
export class AppModule {}

