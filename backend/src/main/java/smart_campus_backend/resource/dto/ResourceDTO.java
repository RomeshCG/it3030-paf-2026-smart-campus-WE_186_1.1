package smart_campus_backend.resource.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import smart_campus_backend.resource.model.ResourceStatus;
import smart_campus_backend.resource.model.ResourceType;

@Data
public class ResourceDTO {
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Type is required")
    private ResourceType type;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be greater than 0")
    private Integer capacity;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Status is required")
    private ResourceStatus status;

    private String imageUrl;
}
