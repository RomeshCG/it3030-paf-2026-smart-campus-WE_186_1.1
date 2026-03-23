package smart_campus_backend.resource.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import smart_campus_backend.resource.model.CampusResource;
import smart_campus_backend.resource.model.ResourceStatus;
import smart_campus_backend.resource.model.ResourceType;

public interface CampusResourceRepository extends JpaRepository<CampusResource, Long> {

    @Query("SELECT r FROM CampusResource r WHERE r.deleted = false " +
            "AND (:type IS NULL OR r.type = :type) " +
            "AND (:status IS NULL OR r.status = :status) " +
            "AND (:capacity IS NULL OR r.capacity >= :capacity)")
    Page<CampusResource> findActiveResourcesWithFilters(
            @Param("type") ResourceType type,
            @Param("status") ResourceStatus status,
            @Param("capacity") Integer capacity,
            Pageable pageable);
}
